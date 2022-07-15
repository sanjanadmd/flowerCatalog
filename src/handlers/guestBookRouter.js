const express = require('express');
const fs = require('fs');

const { getGuestBook, postGuestBook, apiHandler, checkAccess } = require('./guestbook.js');

const { Comments } = require('./comments.js');

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

const addSetup = (setup) => (req, res, next) => {
  Object.entries(setup).map(([key, value]) => {
    req[key] = value;
  });
  next();
};


const guestBookHandler = (setup) => {
  const app = express.Router();
  app.use(addSetup(setup), checkAccess);
  app.get('/comments', getGuestBook);
  app.post('/comments', postGuestBook);
  app.get('/api/comments', apiHandler);
  return app;
};


const guestBookRouter = () => {
  const guestBook = initializeGuestBook('resources/comments.json');
  const addCommentForm = fs.readFileSync('src/templates/addComment.html', 'utf8');

  return guestBookHandler({ guestBook, addCommentForm });
};

module.exports = { guestBookRouter };