const http = require('http');

const startServer = (port, handler) => {
  const server = http.createServer(handler);
  server.listen(port, () => console.log(`listening on port ${port}`));
};

module.exports = { startServer };
