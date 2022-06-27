const { addComment, displayComments } = require("./addComment.js");

const catalogueHandler = (request, response, serveFrom) => {
  const { uri, method } = request;
  if (method !== 'get') {
    return false;
  }

  if (uri === '/guestBook') {
    addComment(request, response, serveFrom);
    return displayComments(response);
  }
};

module.exports = { catalogueHandler };