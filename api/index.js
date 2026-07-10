import server from '../dist/server/server.js';
import { Readable } from 'node:stream';

export default async function handler(req, res) {
  // 1. If Vercel already wrapped it into a Web Request (detected by text() method)
  if (req instanceof Request || typeof req.text === 'function') {
    return await server.fetch(req, {}, {});
  }

  // 2. Otherwise, we are in Node.js legacy handler, convert IncomingMessage to Web Request
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url || '/', `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    } else if (value) {
      headers.append(key, value);
    }
  }

  const init = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = new ReadableStream({
      start(controller) {
        req.on('data', (chunk) => controller.enqueue(chunk));
        req.on('end', () => controller.close());
        req.on('error', (err) => controller.error(err));
      },
    });
    init.duplex = 'half'; // Required by some Node fetch implementations when streaming body
  }

  const webRequest = new Request(url, init);

  try {
    const webResponse = await server.fetch(webRequest, process.env, {});
    
    res.statusCode = webResponse.status;
    res.statusMessage = webResponse.statusText;
    
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (webResponse.body) {
      for await (const chunk of webResponse.body) {
        res.write(chunk);
      }
    }
    res.end();
  } catch (error) {
    console.error('SSR Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error: ' + error.message);
  }
}
