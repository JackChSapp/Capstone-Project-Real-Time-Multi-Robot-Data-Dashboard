import asyncio
import base64
import json
import logging
import struct
from pathlib import Path

import aiohttp
import foxglove
from foxglove import Channel, Schema

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Schema encodings that are transmitted as base64 in the Foxglove WS protocol
_BINARY_SCHEMA_ENCODINGS = {"protobuf", "flatbuffers"}

# Foxglove WS protocol binary opcodes (server -> client)
# foxglove.websocket.v1 uses 4; foxglove.sdk.v1 uses 1
_OP_MESSAGE_DATA = {1, 4}

# Foxglove bridge v3.2+ requires foxglove.sdk.v1; fall back to the legacy protocol
_SUBPROTOCOLS = ["foxglove.sdk.v1", "foxglove.websocket.v1"]


def _resolve_url(ws_url: str) -> str:
    # Inside Docker, localhost/127.0.0.1 resolves to the container itself.
    # Rewrite to host.docker.internal so it reaches the Mac host where the
    # bridge port is exposed.
    return ws_url.replace("localhost", "host.docker.internal").replace(
        "127.0.0.1", "host.docker.internal"
    )


async def record(
    ws_url: str,
    topics: list[str] | None,
    output_path: str,
    stop: asyncio.Event,
) -> None:
    ws_url = _resolve_url(ws_url)
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    # channel_id (from server) -> foxglove Channel
    channels: dict[int, Channel] = {}
    # subscription_id (our local id) -> channel_id
    sub_id_to_channel_id: dict[int, int] = {}
    next_sub_id = 0

    with foxglove.open_mcap(output_path):
        async with aiohttp.ClientSession() as session:
            async with session.ws_connect(
                ws_url, protocols=_SUBPROTOCOLS, max_msg_size=0
            ) as ws:
                logger.info("Connected to %s (protocol: %s)", ws_url, ws.protocol)

                async for msg in ws:
                    if stop.is_set():
                        break

                    if msg.type == aiohttp.WSMsgType.TEXT:
                        data = json.loads(msg.data)
                        op = data.get("op")

                        if op == "advertise":
                            new_subs = []
                            for ch in data.get("channels", []):
                                ch_id = ch["id"]
                                if ch_id in channels:
                                    continue
                                if topics is not None and ch["topic"] not in topics:
                                    continue

                                schema_str = ch.get("schema", "")
                                schema_enc = ch.get("schemaEncoding", "")
                                schema_bytes = (
                                    base64.b64decode(schema_str)
                                    if schema_enc in _BINARY_SCHEMA_ENCODINGS
                                    else schema_str.encode("utf-8")
                                )

                                channels[ch_id] = Channel(
                                    ch["topic"],
                                    message_encoding=ch.get("encoding", ""),
                                    schema=Schema(
                                        name=ch.get("schemaName", ""),
                                        encoding=schema_enc,
                                        data=schema_bytes,
                                    ),
                                )
                                sub_id = next_sub_id
                                next_sub_id += 1
                                sub_id_to_channel_id[sub_id] = ch_id
                                new_subs.append({"id": sub_id, "channelId": ch_id})

                            if new_subs:
                                logger.info(
                                    "Subscribing to %d channel(s): %s",
                                    len(new_subs),
                                    [channels[sub_id_to_channel_id[s["id"]]].topic() for s in new_subs],
                                )
                                await ws.send_str(
                                    json.dumps({"op": "subscribe", "subscriptions": new_subs})
                                )

                        elif op == "unadvertise":
                            for ch_id in data.get("channelIds", []):
                                channels.pop(ch_id, None)

                    elif msg.type == aiohttp.WSMsgType.BINARY:
                        raw = msg.data
                        if len(raw) < 13 or raw[0] not in _OP_MESSAGE_DATA:
                            continue
                        sub_id = struct.unpack_from("<I", raw, 1)[0]
                        timestamp_ns = struct.unpack_from("<Q", raw, 5)[0]
                        payload = raw[13:]

                        ch_id = sub_id_to_channel_id.get(sub_id)
                        if ch_id is not None and ch_id in channels:
                            channels[ch_id].log(payload, log_time=timestamp_ns)

                    elif msg.type in (aiohttp.WSMsgType.CLOSED, aiohttp.WSMsgType.ERROR):
                        logger.warning("WebSocket closed or errored: %s", msg)
                        break
