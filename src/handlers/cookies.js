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
  const cookies = parseCookies(request.headers.cookie);
  request.cookies = cookies;
  const sessionId = request.cookies.sessionId;
  if (sessionId) {
    response.setHeader('set-cookie', `sessionId=${sessionId};Max-Age=10`);
  }
  next();
};

const injectSession = (sessions) => (request, response, next) => {
  const sessionId = request.cookies.sessionId;
  if (sessions[sessionId]) {
    request.session = sessions[sessionId];
  }
  request.sessions = sessions;
  next();
};

const injectUserSession = (request, response, next) => {
  const username = request.bodyParams.get('username');
  const sessionId = new Date().getTime();
  const session = { username, time: new Date().toLocaleString(), sessionId };
  request.session = session;
  response.setHeader('set-cookie', `sessionId=${session.sessionId};Max-Age=10`);
  request.sessions[session.sessionId] = session;
};

const loginHandler = (request, response, next) => {
  if (request.url.pathname !== '/login') {
    next();
    return;
  }

  const username = request.bodyParams.get('username');
  if (request.users[username]) {
    injectUserSession(request, response, next);
  }

  response.statusCode = 302;

  let location = '/loginPage.html';
  if (request.session) {
    location = '/guestBook/comments'
  }

  response.setHeader('Location', location);
  response.end();
};


module.exports = { injectUsers, injectCookie, injectSession, loginHandler };