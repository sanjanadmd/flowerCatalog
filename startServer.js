const { startServer } = require('./src/server/server.js');
const { handler } = require('./src/app.js');

startServer(9000, handler);
