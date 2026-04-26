let socket = null;

export function connectWebSocket() {
  socket = new WebSocket("ws://localhost:5000");
  socket.onopen = () => { console.log("socket connected")};
  socket.onerror = (error) => {console.error("error: ", error)};
  return socket;
}

export function sendMessageToServer(message, history = []) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error ("socket not connected");
    return;
  }

  socket.send(JSON.stringify({ message, history }));
}

export function onToken(callback) {
  if (!socket) return;
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "token") callback(data.token);
    if (data.type === "done") callback(null);
    if (data.type === "error") console.error(data.message);
  }
}