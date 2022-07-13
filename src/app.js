const fs = require('fs');

const { createHandler, bodyParser, serveStaticFile, notFoundHandler } = require('myserver');

const { injectCookie, loginHandler, logoutHandler } = require('./handlers/cookies.js');

const { methodNotAllowed } = require('./handlers/methodNotAllowed.js');
const { guestBookHandler } = require('./handlers/guestbook.js');

const { Comments } = require('./handlers/comments.js');
const { Sessions } = require('./handlers/sessions.js');

const matches = function (method, path) {
  return method === this.method && path === this.url.pathname;
};

const initializeGuestBook = (file) => {
  const guestbook = new Comments(file);
  const records = JSON.parse(fs.readFileSync(file, 'utf8'));
  guestbook.priorComments = records;
  return guestbook;
};

const initializeApp = (config) => {
  const { sessions, guestbook, serveFiles } = config;
  const { aliases, dirPath = './public' } = serveFiles;

  const handleGuestBook = guestBookHandler(guestbook);
  const staticFileServer = serveStaticFile(dirPath, aliases);

  const handlers = [
    bodyParser,
    injectCookie,
    loginHandler,
    logoutHandler,
    handleGuestBook,
    staticFileServer,
    notFoundHandler,
    methodNotAllowed
  ];

  return createHandler({ handlers, matches, sessions });
};

const app = (dirPath) => {
  const serveFiles = {
    dirPath, aliases: { '/': '/flowerCatalog.html' }
  };

  const sessions = new Sessions();
  const guestbook = initializeGuestBook('resources/comments.json');

  return initializeApp({ sessions, guestbook, serveFiles });
};

module.exports = { app, initializeApp };
