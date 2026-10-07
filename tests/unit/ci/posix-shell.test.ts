import { afterEach, describe, expect, it, vi } from "vitest";
import { findPosixShell } from "../../_helpers/posix-shell.js";

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));
import { execFileSync } from "node:child_process";

afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("POSIX fixture runtime selection", () => {
  it("does not select Git Bash or WSL from native Windows Node", () => {
    vi.stubGlobal("process", { ...process, platform: "win32" });
    expect(findPosixShell("bash")).toBeNull();
    expect(findPosixShell("sh")).toBeNull();
    expect(execFileSync).not.toHaveBeenCalled();
  });

  it("returns null when bash is missing on Unix", () => {
    vi.stubGlobal("process", { ...process, platform: "linux" });
    vi.mocked(execFileSync).mockImplementationOnce(() => { throw new Error("ENOENT"); });
    expect(findPosixShell("bash")).toBeNull();
  });

  it("selects bash on Unix when it starts successfully", () => {
    vi.stubGlobal("process", { ...process, platform: "linux" });
    expect(findPosixShell("bash")).toBe("bash");
  });
});
