import { describe, expect, it, beforeAll } from "vitest";
import { encrypt, decrypt } from "../session";

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-do-not-use-in-production";
});

describe("session encrypt/decrypt", () => {
  it("round-trips a valid payload", async () => {
    const token = await encrypt({ userId: "abc123", email: "walterg" });
    const payload = await decrypt(token);
    expect(payload).toEqual({ userId: "abc123", email: "walterg" });
  });

  it("returns null for an undefined token", async () => {
    expect(await decrypt(undefined)).toBeNull();
  });

  it("returns null for a garbage token", async () => {
    expect(await decrypt("not-a-real-jwt")).toBeNull();
  });

  it("returns null for a token signed with a different secret", async () => {
    const token = await encrypt({ userId: "abc123", email: "walterg" });
    process.env.SESSION_SECRET = "a-completely-different-secret";
    expect(await decrypt(token)).toBeNull();
    process.env.SESSION_SECRET = "test-secret-do-not-use-in-production";
  });

  it("returns null for a tampered token", async () => {
    const token = await encrypt({ userId: "abc123", email: "walterg" });
    const tampered = token.slice(0, -4) + "abcd";
    expect(await decrypt(tampered)).toBeNull();
  });
});
