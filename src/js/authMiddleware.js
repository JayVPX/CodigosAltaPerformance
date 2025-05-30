import * as cookie from 'cookie-es';

export default function authMiddleware(req, res, next) {
  const url = req.url;

  // ✅ Ignorar tudo que seja asset do Vite ou não seja uma rota "real de página"
  if (
    url === '/' ||
    url.includes('.js') ||
    url.includes('.css') ||
    url.includes('.map') ||
    url.includes('@vite') ||
    url.includes('/node_modules/') ||
    url.includes('/@fs/') ||
    /\.(ico|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/.test(url)
  ) {
    return next();
  }

  const cookies = cookie.parse(req.headers.cookie || '');

  // Redirecionamento client-side
  if (cookies.isLoggedIn !== 'true') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<script>window.location.href = '/';</script>`);
    return;
  }

  next();
}
