const { createHandler } = require('./server/router.js');
const { fileHandler } = require('./handlers/serveFileContent.js');
const { notFound } = require('./handlers/notFound.js');
const { guestBookHandler } = require('./handlers/guestbook.js');

const handler = createHandler(guestBookHandler, fileHandler('./public'), notFound);

module.exports = { handler };
