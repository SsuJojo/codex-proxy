import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SCRIPT = resolve(import.meta.dirname, "../../../.github/scripts/electron-smoke.ps1");
// Native Windows behavior is exercised by the windows-compatibility CI job.
const describeOnWindows = process.platform === "win32" ? describe : describe.skip;

describeOnWindows("electron-smoke.ps1 preconditions", () => {
  it("has an available PowerShell runtime", () => {
    expect(() => execFileSync("pwsh", ["-NoProfile", "-Command", "exit 0"])).not.toThrow();
  });

  it.each(["unset", "missing", "empty"] as const)("fails clearly for a %s release directory", (kind) => {
    const temp = mkdtempSync(join(tmpdir(), "codex smoke space-"));
    const log = join(temp, "smoke log");
    const env: NodeJS.ProcessEnv = { ...process.env, SMOKE_LOG: log };
    // Environment variable names are case-insensitive on Windows.
    for (const key of Object.keys(env)) {
      if (key.toUpperCase() === "RELEASE_DIR") delete env[key];
    }
    if (kind !== "unset") env.RELEASE_DIR = kind === "missing" ? join(temp, "absent") : temp;
    try {
      const result = spawnSync("pwsh", ["-NoProfile", "-File", SCRIPT], {
        env, encoding: "utf-8", timeout: 10_000,
      });
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      const output = result.stdout + result.stderr;
      expect(output).toContain("::error::");
      expect(output).toContain(kind === "unset" ? "RELEASE_DIR not set" :
        kind === "missing" ? "does not exist" : "Windows unpacked directory not found");
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });
});
