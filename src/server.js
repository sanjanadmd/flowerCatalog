const { createServer } = require('net');
const { loadFileContents } = require("./fetchFiles.js");
const { parseRequest } = require('./request.js');
const { Response } = require('./response.js');

const onRequest = (details, socket, serveFrom, handler, data) => {
  const request = parseRequest(details.toString());
  console.log(request.method, request.uri);
  const response = new Response(socket);
  handler(request, response, serveFrom, data);
};

const startServer = (port, handler, serveFrom) => {
  const data = loadFileContents(serveFrom);
  const server = createServer((socket) => {
    socket.on('error', (err) => {
      console.log(err.message);
    });

    socket.on('data', (details) =>
      onRequest(details, socket, serveFrom, handler, data));

    socket.on('close', () => socket.end());
  });
  server.listen(port, () => console.log(`listening on ${port}`));
};

module.exports = { startServer };