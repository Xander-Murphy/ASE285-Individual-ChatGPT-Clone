import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { sendMessageToServer } from "../../src/lib/services/chatServices";

describe("sendMessageToServer", () => {

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("calls fetch with correct URL and options when no history exists", async () => {
    const mockResponse = { reply: "Hello!" };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await sendMessageToServer("Hi");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hi", history: [] }), // history defaults to []
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("includes chat history when provided", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve({}),
    });

    const history = [
      { role: "user", content: "Previous message" },
      { role: "assistant", content: "Previous reply" }
    ];

    await sendMessageToServer("New message", history);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "New message", history }),
      }
    );
  });

});