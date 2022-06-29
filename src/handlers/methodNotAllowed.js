const html = (content) => `<html><body><h1>${content}</h1></body></html>`;

const methodNotAllowed = (request, response) => {
  response.statusCode = 405;
  response.setHeader('Allow', ['GET']);
  response.end(html(`${request.method} not allowed`));
  return true;
};

module.exports = { methodNotAllowed };