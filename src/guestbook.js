const fs = require('fs');
const { Comments } = require('./comments.js');

const modifyHtml = (title, content) => {
  return `<html><head><title>${title}</title><link rel="stylesheet" href="styles.css"></head><body>${content}</body></html>`
};

const guestBook = (request, response) => {
  const { name, comment } = request.queryParams;
  const comments = new Comments();
  comments.retrieve('resources/comments.json');

  if (name && comment) {
    comments.add(name, comment);
    comments.save('resources/comments.json');
  }

  const addComment = fs.readFileSync('resources/addComment.html', 'utf8');

  const page = modifyHtml('Guest Book', addComment + comments.toTable());

  response.send(page);
  return true;
};

module.exports = { guestBook };