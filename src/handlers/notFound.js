const html = (content) => `<html><body><h1>${content}</h1></body></html>`;

const notFound = (request, response) => {
  if (request.matches('GET', request.url.pathname)) {
    response.statusCode = 404;
    response.end(html('file not found'));
    return true;
  }
  return false;
};

module.exports = { notFound };