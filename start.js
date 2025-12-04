import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start Next.js with custom settings
const nextProcess = spawn("npx", ["next", "dev", "--port", "3010"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
});

// Handle process events
nextProcess.on("error", (error) => {
  console.error("Failed to start server:", error);
});

nextProcess.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  nextProcess.kill("SIGINT");
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  nextProcess.kill("SIGTERM");
});
