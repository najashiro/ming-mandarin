import { createServer } from 'node:http';
import next from 'next';

const application = next({ dev: false, dir: process.cwd() });
const handle = application.getRequestHandler();
await application.prepare();

const server = createServer((request, response) => handle(request, response));
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(3000, '127.0.0.1', resolve);
});

let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  const forcedExit = setTimeout(() => process.exit(0), 2_000);
  forcedExit.unref();
  server.close();
  server.closeAllConnections();
  await application.close().catch(() => undefined);
  process.exit(0);
}

process.on('SIGINT', () => void close());
process.on('SIGTERM', () => void close());
