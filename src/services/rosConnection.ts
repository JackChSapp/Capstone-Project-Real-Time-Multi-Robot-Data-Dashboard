const socket = new WebSocket("ws://127.0.0.1:8765", [
  "foxglove.sdk.v1",
  "foxglove.websocket.v1",
]);

socket.onopen = () => {
  console.log("WebSocket opened");
  console.log("Negotiated protocol:", socket.protocol);
};

socket.onmessage = (event) => {
  console.log("First message from bridge:", event.data);
};

socket.onerror = (event) => {
  console.error("WebSocket error:", event);
};

//export {};