const fs = require('fs');

const { createHandler, bodyParser, serveStaticFile, notFoundHandler } = require('myserver');

const { injectUsers, injectCookie, injectSession, loginHandler, logoutHandler } = require('./handlers/cookies.js');

const { methodNotAllowed } = require('./handlers/methodNotAllowed.js');
const { guestBookHandler } = require('./handlers/guestbook.js');

const { Comments } = require('./handlers/comments.js');
const { Sessions } = require('./handlers/sessions.js');

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
  const users = {
    abc: { username: 'abc' },
    def: { username: 'def' }
  };

  const handlers = [
    bodyParser,
    injectUsers(users),
    injectCookie,
    loginHandler,
    logoutHandler,
    guestBookHandler(createGuestBook('resources/comments.json')),
    serveStaticFile('./public'),
    notFoundHandler,
    methodNotAllowed
  ];
  const sessions = new Sessions();
  return createHandler({ handlers, matches, sessions });
};

const handler = initializeApp();

module.exports = { handler };
