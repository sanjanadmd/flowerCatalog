const createHandler =
  ({ handlers, matches = () => { } }) =>
    (request, response) => {
      request.url = new URL(request.url, `http://${request.headers.host}`);
      request.matches = matches.bind(request);
      for (const handler of handlers) {
        if (handler(request, response)) {
          return true;
        }
      }
    };

exports.createHandler = createHandler;
