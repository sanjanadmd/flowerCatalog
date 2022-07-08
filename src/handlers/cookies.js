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

const injectUsers = (users) => (request, response, next) => {
  request.users = users;
  next();
}

const injectCookie = (request, response, next) => {
  if (request.headers.cookie) {
    const cookies = parseCookies(request.headers.cookie);
    request.cookies = cookies;
  }
  next();
};

const createSession = (request, response, next) => {
  const username = request.bodyParams.get('username');
  const date = new Date();
  const sessionId = date.getTime();
  return { username, time: date.toLocaleString(), sessionId };
};

const logoutHandler = (request, response, next) => {
  if (request.url.pathname !== '/logout') {
    next();
    return;
  }
  const { sessionId } = request.cookies;
  request.sessions.remove(sessionId);

  response.statusCode = 302;
  response.setHeader('set-cookie', `sessionId=${sessionId};Max-Age=0`);
  response.setHeader('Location', '/flowerCatalog.html');
  response.end();
};

const loginHandler = (request, response, next) => {
  if (request.url.pathname !== '/login') {
    next();
    return;
  }

  const username = request.bodyParams.get('username');
  if (username) {
    const session = createSession(request, response, next);
    request.session = session;
    request.sessions.add(session);
    response.setHeader('set-cookie', `sessionId=${session.sessionId}`);
  }

  let location = '/loginPage.html';
  if (request.session) {
    location = '/comments';
  }

  response.statusCode = 302;
  response.setHeader('Location', location);
  response.end();
};


module.exports = { injectUsers, injectCookie, loginHandler, logoutHandler };