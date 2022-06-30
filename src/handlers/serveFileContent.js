const fs = require("fs");
const path = require("path");

const contentType = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.html': 'text/html',
  '.pdf': 'application/pdf'
};


const fileHandler = (serveFrom) => (request, response, next) => {
  const { pathname } = request.url;
  const filename = pathname === '/' ? '/index.html' : pathname;
  try {
    const content = fs.readFileSync(serveFrom + filename);
    const extension = path.extname(filename);
    response.setHeader('Content-type', contentType[extension] || 'text/plain');
    response.end(content);
  } catch (error) {
    next();
  }
  return true;
};

module.exports = { fileHandler };