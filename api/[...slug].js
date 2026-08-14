const serverless = require('serverless-http');
const app = require('../backend/index');

const handler = serverless(app);
module.exports = (req, res) => {
    res.status(200).json({
        mensaje: "API Vercel funcionando"
    });
};