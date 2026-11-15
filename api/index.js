// Vercel Serverless Function entry point bridging Express API routes
import app from '../server/src/server.js';

export default function handler(req, res) {
  const orig = req.headers['x-matched-path'] || req.headers['x-invoke-path'] || req.headers['x-forwarded-uri'];
  if (orig && orig.startsWith('/api') && (req.url === '/api/index.js' || req.url === '/api/index' || req.url === '/api')) {
    req.url = orig;
  }
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}

