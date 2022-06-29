const { URL } = require('url');

const createHandler = (...handlers) => (request, response) => {
  request.url = new URL(request.url, `http://${request.headers.host}`);
  for (const handler of handlers) {
    if (handler(request, response)) {
      return true;
    }
  }
};

exports.createHandler = createHandler;
