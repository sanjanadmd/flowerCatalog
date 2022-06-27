const { guestBook } = require('./guestbook.js');

const catalogueHandler = (request, response, serveFrom) => {
  const { uri, method } = request;
  if (method.toLowerCase() !== 'get') {
    return false;
  }

  if (uri.startsWith('/guestBook')) {
    return guestBook(request, response, serveFrom);
  }
};

module.exports = { catalogueHandler };