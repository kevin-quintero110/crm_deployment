const serverless = require('serverless-http');
const app = require('../backend/index');

module.exports = serverless(app);