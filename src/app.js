const fs = require('fs');

const { createHandler, bodyParser, serveStaticFile, notFoundHandler } = require('myserver');

const { injectUsers, injectCookie, injectSession, loginHandler } = require('./handlers/cookies.js');

const { methodNotAllowed } = require('./handlers/methodNotAllowed.js');
const { guestBookHandler } = require('./handlers/guestbook.js');

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
  const sessions = {};

  const users = {
    hello: { username: 'hello' },
    abcd: { username: 'abcd' }
  };

  const handlers = [
    bodyParser,
    injectUsers(users),
    injectCookie,
    injectSession(sessions),
    loginHandler,
    guestBookHandler(createGuestBook('resources/comments.json')),
    serveStaticFile('./public'),
    notFoundHandler,
    methodNotAllowed
  ];

  return createHandler({ handlers, matches });
};

const handler = initializeApp();

module.exports = { handler };
