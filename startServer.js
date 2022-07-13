const { startServer } = require('myServer');
const { app } = require('./src/app.js');

const serveFrom = process.argv[2];
startServer(9000, app(serveFrom));
