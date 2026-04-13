export async function sendMessageToServer(message) {
  const saved = localStorage.getItem("chat");
  const history = saved ? JSON.parse(saved) : [];

  const response = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  return response.json();
}