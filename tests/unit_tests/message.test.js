import { describe, test, expect, beforeAll, afterAll, vi } from "vitest";
import { createMessage } from "../../src/lib/models/message";

describe("createMessage", () => {

  beforeAll(() => {
    // Mock only the method, not the whole crypto object
    vi.spyOn(global.crypto, "randomUUID").mockReturnValue("mock-uuid-123");

    vi.spyOn(Date, "now").mockReturnValue(1234567890);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("creates a properly structured message object", () => {
    const message = createMessage("user", "Hello world");

    expect(message).toEqual({
      id: "mock-uuid-123",
      role: "user",
      content: "Hello world",
      timestamp: 1234567890
    });
  });

});