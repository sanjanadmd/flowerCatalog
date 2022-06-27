const fs = require('fs');

const { modifyTemplate } = require('./modifyTemplate.js');
const tag = (name, data) => `<${name}>${data}</${name}>`;

const createTable = (comments) => {
  const headers = tag('tr', tag('th', 'DATETIME') + tag('th', 'NAME') + tag('th', 'COMMENT'));
  const data = Object.keys(comments).map((user) => {
    const { name, comment, dt } = comments[user];
    return tag('tr', tag('td', dt) + tag('td', name) + tag('td', comment))
  });
  return headers + data.join(' ');
};

const displayComments = (response) => {
  const comments = JSON.parse(fs.readFileSync('./resources/comments.json'));
  const commentData = tag('table', createTable(comments));
  const addComment = fs.readFileSync('resources/addComment.html', 'utf8');
  const template = fs.readFileSync('resources/htmlTemp.html', 'utf8');
  const page = modifyTemplate(template, {
    content: addComment + commentData,
    title: 'Guest Book'
  })
  response.send(page);
};

const addComment = (request, response) => {
  const { name, comment } = request.queryParams;
  const dt = new Date();
  const comments = JSON.parse(fs.readFileSync('./resources/comments.json'));

  comments[name] = { name, comment, dt: dt.toString() };
  console.log(comments);
  fs.writeFileSync('./resources/comments.json', JSON.stringify(comments), 'utf8');
};

module.exports = { addComment, displayComments };