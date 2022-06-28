const determineContentType = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  html: 'text/html',
  pdf: 'application/ pdf'
};

const getExtension = (file) => {
  return file.slice(file.lastIndexOf('.') + 1);
}

const serveFileContent = (fileName, response, content) => {
  console.log(fileName);
  const extension = getExtension(fileName);
  const contentType = determineContentType[extension];
  response.setHeader('Content-Type', contentType);
  response.send(content);
  return true;
};


const fileHandler = (request, response, serveFrom, data) => {
  let { uri } = request;
  if (uri === '/') {
    uri = '/index.html';
  }
  const content = data[serveFrom + uri];
  if (content) {
    return serveFileContent(serveFrom + uri, response, content);
  }
};

module.exports = { serveFileContent, fileHandler };