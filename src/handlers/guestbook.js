const fs = require('fs');
const { Comments } = require('./comments.js');

const modifyHtml = (title, content) => {
  return `<html><head><title>${title}</title><link rel="stylesheet" href="/styles.css"></head><body>${content}</body></html>`
};

const guestBookPageHandler = (request, response) => {
  const addComment = fs.readFileSync('src/templates/addComment.html', 'utf8');
  const commentHeaders = {
    name: 'name', comment: 'Comment', dateTime: 'DateTime'
  };

  const page = modifyHtml(
    'Guest Book',
    addComment + request.comments.toTable(commentHeaders, 'reverse')
  );

  response.end(page);
  return true;
};

const addBookHandler = (request, response) => {
  const entry = {};
  const { searchParams } = request.url;
  entry.dateTime = new Date().toLocaleString();
  for ([key, value] of searchParams.entries()) {
    entry[key] = value;
  }

  if (entry.name && entry.comment) {
    request.comments.add(entry);
    request.comments.save('resources/comments.json');
  }
  response.statusCode = 302;
  response.setHeader('Location', '/guestBook/comments');
  response.end();
  return true;
};

const guestBookHandler = (request, response) => {
  const comments = new Comments('resources/comments.json');
  comments.retrieve('resources/comments.json');

  if (request.url.pathname === '/guestBook/addComment') {
    request.comments = comments;
    return addBookHandler(request, response);
  }

  if (request.url.pathname === '/guestBook/comments') {
    request.comments = comments;
    return guestBookPageHandler(request, response);
  }

  return false;
};

module.exports = { guestBookHandler };