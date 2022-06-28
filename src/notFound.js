const html = (content) => `<html><body><h1>${content}</h1></body></html>`;

const notFound = (request, response) => {
  response.statusCode = 404;
  response.send(html('file not found'));
  return true;
};

module.exports = { notFound };