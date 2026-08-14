const serverless = require('serverless-http');
const app = require('../backend/index');

const handler = serverless(app);

module.exports = (req, res) => {
  // Quitar prefijo /api para que las rutas de Express coincidan
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '') || '/';
  }
  return handler(req, res);
};
