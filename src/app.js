const express = require('express');
const fs = require('fs');

const { injectCookie, loginHandler, logoutHandler } = require('./handlers/cookies.js');

const { guestBookRouter } = require('./handlers/guestBookRouter.js');
const { Sessions } = require('./handlers/sessions.js');

const matches = function (method, path) {
  return method === this.method && path === this.url.pathname;
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
  const app = express();

  app.use(addSetup(setup));
  app.use(injectTime, injectMatches);

  app.use(express.text());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(injectCookie);

  app.use('/login', loginHandler);

  app.get('/logout', logoutHandler);

  app.use('/guest-book', guestBookRouter());

  return app;
};

const app = () => {
  const sessions = new Sessions();
  return createApp({ sessions });
};

module.exports = { app, createApp };
