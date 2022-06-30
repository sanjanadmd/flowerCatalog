const identity = (x) => x;

const createNext = handlers => {
  let index = -1;
  const callNextHandler = (req, res) => {
    index++;
    const currentHandler = handlers[index];
    if (currentHandler) {
      currentHandler(req, res, () => callNextHandler(req, res));
    }
  };
  return callNextHandler;
};

const createHandler = ({ handlers, matches = identity }) => {
  return (req, res) => {
    req.url = new URL(req.url, `http://${req.headers.host}`);
    req.timeStamp = new Date();
    req.matches = matches.bind(req);
    const next = createNext(handlers);
    next(req, res);
  };

};

exports.createHandler = createHandler;
