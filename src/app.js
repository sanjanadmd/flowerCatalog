const fs = require('fs');

const { createHandler } = require('./server/router.js');

const { bodyParser } = require('./handlers/bodyParser.js');

const { methodNotAllowed } = require('./handlers/methodNotAllowed.js');
const { guestBookHandler } = require('./handlers/guestbook.js');
const { fileHandler } = require('./handlers/serveFileContent.js');
const { notFoundHandler } = require('./handlers/notFound.js');

const { Comments } = require('./handlers/comments.js');

const matches = function (method, path) {
  return method === this.method && path === this.url.pathname;
};

const createGuestBook = (file) => {
  const guestbook = new Comments(file);
  const records = JSON.parse(fs.readFileSync(file, 'utf8'));
  guestbook.priorComments = records;
  return guestbook;
};

const initializeApp = () => {
  const handlers = [
    bodyParser,
    guestBookHandler(createGuestBook('resources/comments.json')),
    fileHandler('./public'),
    notFoundHandler,
    methodNotAllowed
  ];

  return createHandler({ handlers, matches });
};

const handler = initializeApp();

module.exports = { handler };
