const modifyHtml = (title, content) => {
  return `<html><head><title>${title}</title><link rel="stylesheet" href="/styles.css"><script src="/scripts/postComment.js"></script></head><body>${content}</body></html>`
};


const createEntry = (request, timeStamp) => {
  const { body } = request;
  const { sessionId } = request.cookies;
  const entry = {};
  entry.dateTime = timeStamp;
  entry.name = request.sessions.getSession(sessionId).username;
  entry.comment = body.comment;
  return entry;
};

const getGuestBook = (request, response) => {
  const comments = request.addCommentForm;
  const content = comments?.replaceAll('__COMMENT__', request.guestBook.toTable());
  const page = modifyHtml('Guest Book', content);

  response.set('Content-Type', 'text/html');
  response.end(page);
  return true;
};

const postGuestBook = (request, response) => {
  const { guestBook } = request;
  const entry = createEntry(request, request.timeStamp.toLocaleString());

  if (entry.name && entry.comment) {
    guestBook.add(entry);
    guestBook.save();
  }

  response.status(201);
  response.end('submitted');
  return true;
};

const apiHandler = (request, response) => {
  response.set('Content-Type', 'application/json');
  response.end(request.guestBook.comments);
  return true;
};
module.exports = { getGuestBook, postGuestBook, apiHandler };