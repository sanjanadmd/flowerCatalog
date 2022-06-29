const fs = require('fs');
const { Comments } = require('./comments.js');

const modifyHtml = (title, content) => {
  return `<html><head><title>${title}</title><link rel="stylesheet" href="/styles.css"></head><body>${content}</body></html>`
};

const createEntry = (searchParams) => {
  const entry = {};
  entry.dateTime = new Date().toLocaleString();
  for ([key, value] of searchParams.entries()) {
    entry[key] = value;
  }
  return entry;
}

const getRecords = (file) => {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const guestBookPageHandler = (request, response) => {
  const addComment = fs.readFileSync('src/templates/addComment.html', 'utf8');
  const commentHeaders = {
    name: 'name', comment: 'Comment', dateTime: 'DateTime'
  };

  const content = addComment + request.comments.toTable(commentHeaders, 'reverse');
  const page = modifyHtml('Guest Book', content);

  response.end(page);
  return true;
};

const addBookHandler = (request, response) => {
  const { searchParams } = request.url;
  const entry = createEntry(searchParams);

  if (entry.name && entry.comment) {
    request.comments.add(entry);
    request.comments.saveTo('resources/comments.json');
  }
  response.statusCode = 302;
  response.setHeader('Location', '/guestBook/comments');
  response.end();
  return true;

};

const guestBookHandler = (commentsFile) => (request, response) => {
  const comments = new Comments();
  const records = getRecords(commentsFile);
  comments.priorComments = records;

  if (request.matches('GET', '/guestBook/addComment')) {
    request.comments = comments;
    return addBookHandler(request, response);
  }

  if (request.matches('GET', '/guestBook/comments')) {
    request.comments = comments;
    return guestBookPageHandler(request, response);
  }

  return false;
};

module.exports = { guestBookHandler };