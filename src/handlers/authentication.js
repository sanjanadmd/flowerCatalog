const { sessionExistance, createSession } = require('./cookies.js');

const logoutHandler = (request, response) => {
  const { sessionId } = request.cookies;
  request.sessions.remove(sessionId);

  response.status(302);
  response.clearCookie(sessionId);
  response.set('Location', '/flowerCatalog.html');
  response.end();
};

const loginHandler = (request, response, next) => {
  let location = '/loginPage.html';

  const session = sessionExistance(request.cookies, request.sessions);
  if (session) {
    response.cookie('sessionId', request.cookies.sessionId);
    location = '/guest-book/comments';
  }

  const username = request.body?.username;
  if (username && !session) {
    const session = createSession(request, response, next);
    request.session = session;
    request.sessions.add(session);
    response.cookie('sessionId', session.sessionId);
    location = '/guest-book/comments';
  }
  response.redirect(location);
  response.end();
};


module.exports = { loginHandler, logoutHandler };