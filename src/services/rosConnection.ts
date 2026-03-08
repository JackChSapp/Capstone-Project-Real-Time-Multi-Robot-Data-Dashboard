export const rosSocket = new WebSocket("ws://localhost:8765");

rosSocket.onopen = () => {
  console.log("Connected to Foxglove Bridge");
};

rosSocket.onmessage = (event) => {
  console.log("ROS message:", event.data);
};

rosSocket.onerror = (err) => {
  console.error("WebSocket error:", err);
};