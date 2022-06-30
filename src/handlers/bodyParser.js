const bodyParser = (request, response, next) => {
  let params = '';
  request.setEncoding('utf8');
  request.on('data', (chunk) => params += chunk);
  request.on('end', () => {
    request.bodyParams = new URLSearchParams(params);
    next();
  })
};

module.exports = { bodyParser };