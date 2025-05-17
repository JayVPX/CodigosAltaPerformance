import { parse } from 'cookie';

export default function authMiddleware(req, res, next) {
  const url = req.url;
  if (
    url === '/' ||
    url === '/index.html' ||
    url.startsWith('/js/') ||
    url.startsWith('/css/') ||
    url.startsWith('/img/') ||
    url === '/favicon.ico'
  ) {
    return next();
  }

  const cookies = parse(req.headers.cookie || '');
  if (cookies.isLoggedIn !== 'true') {
    res.statusCode = 302;
    res.setHeader('Location', '/index.html');
    return res.end();
  }

  next();
}
