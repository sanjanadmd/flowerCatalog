const express = require('express');
const fs = require('fs');

const { injectCookie, loginHandler, logoutHandler } = require('./handlers/cookies.js');

const { getGuestBook, postGuestBook, apiHandler } = require('./handlers/guestbook.js');

const { Comments } = require('./handlers/comments.js');
const { Sessions } = require('./handlers/sessions.js');

const matches = function (method, path) {
  return method === this.method && path === this.url.pathname;
};

const read = (path) => {
  return JSON.parse(fs.readFileSync(path, 'utf8'))
};

const write = (path, comments) => {
  fs.writeFileSync(path, comments, 'utf8');
};

const initializeGuestBook = (guestBookPath) => {
  const guestbook = new Comments(guestBookPath, read, write);
  guestbook.initialize();
  return guestbook;
};

const injectMatches = (req, res, next) => {
  req.matches = matches;
  next();
};

const injectTime = (req, res, next) => {
  req.timeStamp = new Date();
  next();
};

const addSetup = (setup) => (req, res, next) => {
  Object.entries(setup).map(([key, value]) => {
    req[key] = value;
  });
  next();
};

const createApp = (setup) => {
  const appInitialize = express();

  appInitialize.use(addSetup(setup));
  appInitialize.use(injectTime, injectMatches);

  appInitialize.use(express.text());
  appInitialize.use(express.urlencoded({ extended: true }));
  appInitialize.use(express.static('public'));
  appInitialize.use(injectCookie);
  appInitialize.get('/login', loginHandler);
  appInitialize.post('/login', loginHandler);
  appInitialize.get('/logout', logoutHandler);

  appInitialize.get('/comments', getGuestBook);
  appInitialize.post('/comments', postGuestBook);
  appInitialize.get('/api/comments', apiHandler);

  return appInitialize;
};

const app = () => {
  const sessions = new Sessions();
  const guestBook = initializeGuestBook('resources/comments.json');

  return createApp({ sessions, guestBook });
};

module.exports = { app, createApp };
