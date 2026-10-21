// Local QA only: serve dist/ with the exact headers declared for Vercel.
// STANDARD_CSP_MODE=enforce tests the complete candidate policy locally.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const headers = Object.fromEntries(config.headers.flatMap(rule => rule.headers.map(({ key, value }) => [key, value])));
if (process.env.STANDARD_CSP_MODE === 'enforce') {
  headers['Content-Security-Policy'] = headers['Content-Security-Policy-Report-Only'];
  delete headers['Content-Security-Policy-Report-Only'];
}
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
const server = createServer(async (request, response) => {
  for (const [key, value] of Object.entries(headers)) response.setHeader(key, value);
  response.setHeader('Cache-Control', 'no-store');
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (pathname !== '/' && pathname.endsWith('/')) {
      response.writeHead(308, { Location: pathname.replace(/\/+$/, '') });
      response.end();
      return;
    }
    const filename = extname(pathname) ? pathname : `${pathname === '/' ? '' : pathname}/index.html`;
    const path = resolve(root, `.${filename}`);
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) throw new Error('Outside build');
    const body = await readFile(path);
    response.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
    response.writeHead(200);
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});
server.listen(4322, '127.0.0.1', () => console.log(`QA build: http://127.0.0.1:4322 (CSP: ${process.env.STANDARD_CSP_MODE === 'enforce' ? 'candidate enforced' : 'report-only'})`));
const stop = () => { server.closeAllConnections(); server.close(() => process.exit(0)); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
