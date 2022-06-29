const fs = require('fs');

const { Comments } = require('./comments.js');
const { createHandler } = require('../server/router.js');
const { guestBookHandler } = require('./guestbook.js');
const { fileHandler } = require('./serveFileContent.js');
const { notFound } = require('./notFound.js');

const matches = function (method, path) {
  return method === this.method && path === this.url.pathname;
};

const createComment = (file) => {
  const comments = new Comments();
  const records = JSON.parse(fs.readFileSync(file, 'utf8'));
  comments.priorComments = records;
  comments.reference = file;
  return comments;
};

const handlers = [
  guestBookHandler(createComment('resources/comments.json')),
  fileHandler('./public'),
  notFound
];

const getHandler = createHandler({ handlers, matches });

module.exports = { getHandler };