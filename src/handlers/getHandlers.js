const { createHandler } = require('../server/router.js');
const { guestBookHandler } = require('./guestbook.js');
const { fileHandler } = require('./serveFileContent.js');
const { notFound } = require('./notFound.js');

const matches = function (method, path) {
  return method === this.method && path === this.url.pathname;
};

const handlers = [guestBookHandler('resources/comments.json'), fileHandler('./public'), notFound];

const getHandler = createHandler({ handlers, matches });

module.exports = { getHandler };