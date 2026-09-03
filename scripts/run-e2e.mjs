import { spawn } from 'node:child_process';

const server = spawn(process.execPath, ['scripts/e2e-server.mjs'], { stdio: 'inherit', env: process.env });

async function waitUntilReady() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`El servidor E2E terminó antes de iniciar (${server.exitCode}).`);
    try { if ((await fetch('http://127.0.0.1:3000')).ok) return; } catch { /* continúa */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('El servidor E2E no respondió a tiempo.');
}

async function stopServer() {
  if (server.exitCode !== null) return;
  server.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => server.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
  if (server.exitCode === null) server.kill('SIGKILL');
}

let result = 1;
try {
  await waitUntilReady();
  const runner = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)], {
    stdio: 'inherit', env: { ...process.env, PLAYWRIGHT_EXTERNAL_SERVER: '1' },
  });
  result = await new Promise((resolve) => runner.once('exit', (code) => resolve(code ?? 1)));
} finally {
  await stopServer();
}
process.exit(result);
