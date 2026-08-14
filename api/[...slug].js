const serverless = require('serverless-http');
const app = require('../backend/index');

const handler = serverless(app);

module.exports = (req, res) => {
    if (req.url && req.url.startsWith('/api')) {
        req.url = req.url.replace(/^\/api/, '') || '/';
    }

    return handler(req, res);
};