const { startServer } = require('myServer');
const { handler } = require('./src/app.js');

startServer(9000, handler);
