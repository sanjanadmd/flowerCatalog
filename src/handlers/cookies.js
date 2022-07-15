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

const sessionExistance = (cookies, sessions) => {
  if (cookies) {
    return sessions.isPresent(cookies.sessionId);
  }
  return false;
};

const verifyAccess = (request, response, next) => {
  const session = sessionExistance(request.cookies, request.sessions);
  if (!session) {
    response.redirect('/login');
    response.end();
    return;
  }
  next();
};

const createSession = (request, response, next) => {
  const username = request.body.username;
  const date = new Date();
  const sessionId = date.getTime();
  return { username, time: date.toLocaleString(), sessionId };
};

module.exports = { injectCookie, createSession, verifyAccess, sessionExistance };