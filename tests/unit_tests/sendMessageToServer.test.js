class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1;
    this.send = vi.fn();
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
    MockWebSocket.instance = this;
  }
}
MockWebSocket.OPEN = 1;
MockWebSocket.CLOSED = 3;
MockWebSocket.instance = null;

vi.stubGlobal("WebSocket", MockWebSocket);

import { connectWebSocket, sendMessageToServer, onToken } from "../../src/lib/services/chatServices";

beforeEach(() => {
  MockWebSocket.instance = null;
  connectWebSocket();
});

it("connectWebSocket creates a WebSocket connection", () => {
  expect(MockWebSocket.instance).not.toBeNull();
  expect(MockWebSocket.instance.url).toBe("ws://localhost:5000");
});

it("sendMessageToServer sends message and history over the socket", () => {
  const history = [{ role: "user", content: "Hello" }];
  sendMessageToServer("Hi", history);
  expect(MockWebSocket.instance.send).toHaveBeenCalledWith(
    JSON.stringify({ message: "Hi", history })
  );
});

it("sendMessageToServer sends empty history by default", () => {
  sendMessageToServer("Hi");
  expect(MockWebSocket.instance.send).toHaveBeenCalledWith(
    JSON.stringify({ message: "Hi", history: [] })
  );
});

it("sendMessageToServer does not send if socket is not open", () => {
  MockWebSocket.instance.readyState = 3;
  sendMessageToServer("Hi");
  expect(MockWebSocket.instance.send).not.toHaveBeenCalled();
});

it("onToken fires callback with each token", () => {
  const callback = vi.fn();
  onToken(callback);
  MockWebSocket.instance.onmessage({ data: JSON.stringify({ type: "token", token: "Hello" }) });
  MockWebSocket.instance.onmessage({ data: JSON.stringify({ type: "token", token: " world" }) });
  expect(callback).toHaveBeenCalledWith("Hello");
  expect(callback).toHaveBeenCalledWith(" world");
});

it("onToken fires callback with null when done", () => {
  const callback = vi.fn();
  onToken(callback);
  MockWebSocket.instance.onmessage({ data: JSON.stringify({ type: "done" }) });
  expect(callback).toHaveBeenCalledWith(null);
});