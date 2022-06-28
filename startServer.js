const { fileHandler } = require('./src/serveFileContent.js');
const { startServer } = require('./src/server.js');
const { catalogueHandler } = require('./src/catalogueHandler.js');
const { notFound } = require('./src/notFound.js');

const createHandler = (handlers) => (request, response, serveFrom, data) => {
  for (const handler of handlers) {
    if (handler(request, response, serveFrom, data)) {
      return true;
    }
  }
}

const handlers = [fileHandler, catalogueHandler, notFound];

startServer(9000, createHandler(handlers), './public');
