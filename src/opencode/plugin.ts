import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type ResolvedCommand = {
  cmd: string;
  args: string[];
};

function resolveSpecflowCommand(worktree?: string, directory?: string): ResolvedCommand {
  const envOverride = process.env.SPECFLOW_BIN?.trim();
  if (envOverride) {
    return { cmd: envOverride, args: [] };
  }

  const candidates: string[] = [];
  if (worktree) candidates.push(path.join(worktree, "node_modules", ".bin", "specflow"));
  if (directory && directory !== worktree) {
    candidates.push(path.join(directory, "node_modules", ".bin", "specflow"));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return { cmd: candidate, args: [] };
    }
  }

  if (worktree) {
    const distEntry = path.join(worktree, "dist", "index.js");
    if (fs.existsSync(distEntry)) {
      return { cmd: process.execPath, args: [distEntry] };
    }
  }

  return { cmd: "specflow", args: [] };
}

function normalizeCwd(worktree?: string, directory?: string, cwd?: string): string | undefined {
  if (cwd) return cwd;
  if (directory) return directory;
  return worktree;
}

export const SpecflowPlugin: Plugin = async () => {
  return {
    tool: {
      specflow: tool({
        description:
          "Run the SpecFlow CLI (init/parse/design/implement/verify/secure).",
        args: {
          command: tool.schema.string(),
          args: tool.schema.array(tool.schema.string()).optional(),
          cwd: tool.schema.string().optional(),
        },
        async execute({ command, args, cwd }, context) {
          const allowed = new Set([
            "init",
            "parse",
            "design",
            "implement",
            "verify",
            "secure",
            "dev",
          ]);

          if (!allowed.has(command)) {
            return `Invalid command "${command}". Allowed: ${[...allowed].join(", ")}`;
          }

          const { directory, worktree } = context;
          const resolved = resolveSpecflowCommand(worktree, directory);
          const finalArgs = [...resolved.args, command, ...(args ?? [])];
          const runCwd = normalizeCwd(worktree, directory, cwd);

          try {
            const { stdout, stderr } = await execFileAsync(
              resolved.cmd,
              finalArgs,
              {
                cwd: runCwd,
                env: process.env,
              }
            );

            const output = [stdout, stderr].filter(Boolean).join("\n").trim();
            return output.length > 0
              ? output
              : "SpecFlow completed with no output.";
          } catch (error: any) {
            const code = typeof error?.code === "number" ? error.code : "unknown";
            const stdout = error?.stdout?.toString?.() ?? "";
            const stderr = error?.stderr?.toString?.() ?? "";
            const output = [stdout, stderr].filter(Boolean).join("\n").trim();
            return `SpecFlow failed (exit code ${code}).\n${output}`.trim();
          }
        },
      }),
    },
  };
};
