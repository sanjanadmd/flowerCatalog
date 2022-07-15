const parseCookies = (cookieString) => {
  const cookies = {};
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [key, value] = cookie.split('=');
      cookies[key] = value;
    });
  }
  return cookies;
};

const injectCookie = (request, response, next) => {
  let cookies = {};
  if (request.headers.cookie) {
    cookies = parseCookies(request.headers.cookie);
  }
  request.cookies = cookies;
  next();
};

const createSession = (request, response, next) => {
  const username = request.body.username;
  const date = new Date();
  const sessionId = date.getTime();
  return { username, time: date.toLocaleString(), sessionId };
};

const logoutHandler = (request, response) => {
  const { sessionId } = request.cookies;
  request.sessions.remove(sessionId);

  response.status(302);
  response.clearCookie(sessionId);
  response.set('Location', '/flowerCatalog.html');
  response.end();
};


const sessionExistance = (cookies, sessions) => {
  if (cookies) {
    return sessions.isPresent(cookies.sessionId);
  }
  return false;
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


module.exports = { injectCookie, loginHandler, logoutHandler };