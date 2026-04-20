import asyncio
import logging
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from mcap_recorder.recorder import record

logger = logging.getLogger(__name__)

app = FastAPI(title="MCAP Recorder")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_recording_task: asyncio.Task | None = None
_stop_event: asyncio.Event | None = None
_current_output: str | None = None


class StartRequest(BaseModel):
    ws_url: str
    topics: list[str] | None = None
    output_dir: str = "/recordings"


class StartResponse(BaseModel):
    status: str
    output: str


class StopResponse(BaseModel):
    status: str
    path: str


class StatusResponse(BaseModel):
    recording: bool
    output: str | None


@app.post("/start", response_model=StartResponse)
async def start_recording(req: StartRequest) -> StartResponse:
    global _recording_task, _stop_event, _current_output

    if _recording_task and not _recording_task.done():
        raise HTTPException(status_code=409, detail="Recording already in progress")

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    output_path = str(Path(req.output_dir) / f"{timestamp}.mcap")

    _stop_event = asyncio.Event()
    _current_output = output_path
    _recording_task = asyncio.create_task(
        record(req.ws_url, req.topics, output_path, _stop_event)
    )
    _recording_task.add_done_callback(
        lambda t: logger.error("Recording task failed: %s", t.exception()) if not t.cancelled() and t.exception() else None
    )

    return StartResponse(status="started", output=output_path)


@app.post("/stop", response_model=StopResponse)
async def stop_recording() -> StopResponse:
    global _recording_task, _stop_event, _current_output

    if not _recording_task or _recording_task.done():
        raise HTTPException(status_code=409, detail="No recording in progress")

    _stop_event.set()
    try:
        await asyncio.wait_for(asyncio.shield(_recording_task), timeout=10)
    except asyncio.TimeoutError:
        _recording_task.cancel()

    path = _current_output
    _recording_task = None
    _stop_event = None
    _current_output = None

    return StopResponse(status="stopped", path=path)


@app.get("/status", response_model=StatusResponse)
async def status() -> StatusResponse:
    recording = bool(_recording_task and not _recording_task.done())
    return StatusResponse(recording=recording, output=_current_output if recording else None)
