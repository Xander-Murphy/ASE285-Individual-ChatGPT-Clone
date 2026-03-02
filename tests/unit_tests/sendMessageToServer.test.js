import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { sendMessageToServer } from "../../src/lib/services/chatServices";

describe("sendMessageToServer", () => {

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("calls fetch with correct URL and options", async () => {
    const mockResponse = { reply: "Hello!" };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await sendMessageToServer("Hi");

    // Check fetch was called correctly
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hi" }),
      }
    );

    // Check returned value
    expect(result).toEqual(mockResponse);
  });

});