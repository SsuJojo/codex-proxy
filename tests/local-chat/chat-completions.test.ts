import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const baseUrl = "http://localhost:8080/v1/chat/completions";
const apiKey = "sk-ssujojoqwer1234aaaa";

async function runCurl(payload: Record<string, unknown>) {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "-sS",
      "-w",
      "\n%{http_code}",
      baseUrl,
      "-H",
      "Content-Type: application/json",
      "-H",
      `Authorization: Bearer ${apiKey}`,
      "-d",
      JSON.stringify(payload),
    ],
    { timeout: 30000 }
  );

  const lines = stdout.split("\n");
  const statusLine = lines.pop() ?? "";
  const body = lines.join("\n");
  const status = Number(statusLine.trim());

  return { status, body };
}

describe("local chat completions (curl)", () => {
  it("gpt-5.4 returns OK", async () => {
    const { status, body } = await runCurl({
      model: "gpt-5.4",
      messages: [{ role: "user", content: "Directly reply OK." }],
    });

    expect(status).toBe(200);
    expect(body).toContain("OK");
  });

  it("gpt-5.4-mini returns OK", async () => {
    const { status, body } = await runCurl({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "Directly reply OK." }],
    });

    expect(status).toBe(200);
    expect(body).toContain("OK");
  });

  it("gpt-5.4-mini-fast returns OK", async () => {
    const { status, body } = await runCurl({
      model: "gpt-5.4-mini-fast",
      messages: [{ role: "user", content: "Directly reply OK." }],
    });

    expect(status).toBe(200);
    expect(body).toContain("OK");
  });

  it("gpt-5.4-xhigh-fast returns OK", async () => {
    const { status, body } = await runCurl({
      model: "gpt-5.4-xhigh-fast",
      messages: [{ role: "user", content: "Directly reply OK." }],
    });

    expect(status).toBe(200);
    expect(body).toContain("OK");
  });

  it("gpt-5.4-xhigh returns OK", async () => {
    const { status, body } = await runCurl({
      model: "gpt-5.4-xhigh",
      messages: [{ role: "user", content: "Directly reply OK." }],
    });

    expect(status).toBe(200);
    expect(body).toContain("OK");
  });

  it("openrouter/free returns OK", async () => {
    const { status, body } = await runCurl({
      model: "openrouter/free",
      messages: [{ role: "user", content: "Directly reply OK." }],
    });

    expect(status).toBe(200);
    expect(body).toContain("OK");
  });

  it("minimaxai/minimax-m2.7 returns OK", async () => {
    const { status, body } = await runCurl({
      model: "minimaxai/minimax-m2.7",
      messages: [{ role: "user", content: "Directly reply OK." }],
    });

    expect(status).toBe(200);
    expect(body).toContain("OK");
  });
});
