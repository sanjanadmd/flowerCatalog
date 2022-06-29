const identity = (x) => x;

const createHandler =
  ({ handlers, matches = identity }) =>
    (request, response) => {
      request.url = new URL(request.url, `http://${request.headers.host}`);
      request.timeStamp = new Date();
      request.matches = matches.bind(request);
      for (const handler of handlers) {
        if (handler(request, response)) {
          return true;
        }
      }
    };

exports.createHandler = createHandler;
