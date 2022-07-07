const fs = require('fs');

const modifyHtml = (title, content) => {
  return `<html><head><title>${title}</title><link rel="stylesheet" href="/styles.css"></head><body>${content}</body></html>`
};

const createEntry = (request, timeStamp) => {
  const { bodyParams } = request;
  const { sessionId } = request.cookies;
  const entry = {};
  entry.dateTime = timeStamp;
  entry.name = request.sessions.getSession(sessionId).username;
  entry.comment = bodyParams.get('comment');
  return entry;
};

const updateGuestBook = (path, comments) => {
  fs.writeFileSync(path, comments, 'utf8');
};

const guestBookPageHandler = (request, response) => {
  const form = fs.readFileSync('src/templates/addComment.html', 'utf8');
  const commentHeaders = ['DateTime', 'Name', 'Comment'];

  const content = form + request.guestBook.toTable(commentHeaders, 'reverse');
  const page = modifyHtml('Guest Book', content);
  response.end(page);
  return true;
};

const postGuestBook = (request, response) => {
  const { guestBook } = request;
  const entry = createEntry(request, request.timeStamp.toLocaleString());

  if (entry.name && entry.comment) {
    guestBook.add(entry);
    updateGuestBook(guestBook.reference, guestBook.comments);
  }
  response.statusCode = 302;
  response.setHeader('Location', '/guestBook/comments');
  response.end();
  return true;

};

const guestBook = (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.end(request.guestBook.comments);
  return true;
};

const guestBookHandler = (comments) => (request, response, next) => {

  if (request.matches('GET', '/api/comments')) {
    request.guestBook = comments;
    return guestBook(request, response);
  }
  if (request.matches('GET', '/guestBook/comments')) {
    request.guestBook = comments;
    return guestBookPageHandler(request, response);
  }

  if (request.matches('POST', '/guestBook/addComment')) {
    request.guestBook = comments;
    return postGuestBook(request, response);
  }

  next();
};

module.exports = { guestBookHandler };