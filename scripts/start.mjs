import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

if (databaseUrl.startsWith("file:")) {
  const filePath = databaseUrl.replace(/^file:/, "");
  const directory = dirname(filePath);
  if (directory && directory !== "." && directory !== "/") {
    mkdirSync(directory, { recursive: true });
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

const port = process.env.PORT || "43123";

await run("npx", ["prisma", "db", "push", "--skip-generate"]);
await run("npx", ["tsx", "prisma/seed.ts", "--if-empty"]);
await run("npx", ["next", "start", "-H", "0.0.0.0", "-p", port]);
