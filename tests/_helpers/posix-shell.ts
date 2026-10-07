import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

/**
 * These fixtures create POSIX executables and colon-separated PATH entries.
 * Windows Node + Git Bash/WSL is not a supported fixture environment. Run
 * them with Unix Node (including inside WSL); native Windows is tested via
 * the PowerShell smoke suite instead.
 */
export function findPosixShell(kind: "bash" | "sh"): string | null {
  if (process.platform === "win32") return null;
  const candidates = kind === "bash" ? ["bash"] : ["/bin/sh", "/usr/bin/sh", "sh"];
  for (const candidate of candidates) {
    if (candidate.includes("/") && !existsSync(candidate)) continue;
    try {
      execFileSync(candidate, ["-c", "exit 0"], { stdio: "ignore", timeout: 1000 });
      return candidate;
    } catch {
      // Try the next executable. Static file/wiring assertions still run.
    }
  }
  return null;
}
