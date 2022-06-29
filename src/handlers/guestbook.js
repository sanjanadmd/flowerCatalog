const fs = require('fs');

const modifyHtml = (title, content) => {
  return `<html><head><title>${title}</title><link rel="stylesheet" href="/styles.css"></head><body>${content}</body></html>`
};

const createEntry = (searchParams, timeStamp) => {
  const entry = {};
  entry.dateTime = timeStamp;
  entry.name = searchParams.get('name');
  entry.comment = searchParams.get('comment');
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

const addBookHandler = (request, response) => {
  const { guestBook } = request;
  const { searchParams } = request.url;
  const entry = createEntry(searchParams, request.timeStamp.toLocaleString());

  if (entry.name && entry.comment) {
    guestBook.add(entry);
    updateGuestBook(guestBook.reference, guestBook.comments);
  }
  response.statusCode = 302;
  response.setHeader('Location', '/guestBook/comments');
  response.end();
  return true;

};

const guestBookHandler = (comments) => (request, response) => {

  if (request.matches('GET', '/guestBook/addComment')) {
    request.guestBook = comments;
    return addBookHandler(request, response);
  }

  if (request.matches('GET', '/guestBook/comments')) {
    request.guestBook = comments;
    return guestBookPageHandler(request, response);
  }

  return false;
};

module.exports = { guestBookHandler };