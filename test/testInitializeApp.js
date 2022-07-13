const request = require('supertest');
const assert = require('assert');

const { initializeApp } = require('../src/app.js');

const { Comments } = require('../src/handlers/comments.js');
const { Sessions } = require('../src/handlers/sessions.js');

const createConfig = (session) => {
  const serveFiles = {
    dirPath: './public', aliases: { '/': '/flowerCatalog.html' }
  };
  const guestbook = new Comments();
  const sessions = new Sessions();

  if (session === 'create-session') {
    const userSession = { sessionId: 1, username: 'pen' };
    sessions.add(userSession);
  }
  return { sessions, serveFiles, guestbook };
}

describe('Initialize App', () => {

  it('Should create a session when user is not present', (done) => {
    const config = createConfig();
    const handler = initializeApp(config);

    request(handler)
      .post('/login')
      .send('username=pen')
      .expect(302)
      .expect('Location', '/comments')
      .end((err) => {
        const newSession = config.sessions.getInfo();
        const result = Object.entries(newSession).some(([, session]) => session.username === 'pen');
        assert.ok(result);
        done(err);
      });
  });

  describe('When session exists', () => {

    it('Should post the comment', (done) => {
      const config = createConfig('create-session');
      const handler = initializeApp(config);

      request(handler)
        .post('/comments')
        .set('Cookie', 'sessionId=1')
        .expect(201)
        .expect('submitted', done);
    });

    it('Should display comments page with exisiting comments', (done) => {
      const config = createConfig('create-session');
      const handler = initializeApp(config);
      request(handler)
        .get('/comments')
        .set('Cookie', 'sessionId=1')
        .expect(200)
        .expect('Content-Type', 'text/html', done);
    });

    it('Should respond with comments with api', (done) => {
      const config = createConfig('create-session');
      const handler = initializeApp(config);

      request(handler)
        .get('/api/comments')
        .set('Cookie', 'sessionId=1')
        .expect(200)
        .expect('Content-Type', 'application/json', done);
    });

    it('Should logout from the session', (done) => {
      const config = createConfig('create-session');
      const handler = initializeApp(config);

      request(handler)
        .get('/logout')
        .set('Cookie', 'sessionId=1')
        .expect(302)
        .expect('Location', '/flowerCatalog.html')
        .end((err) => {
          const newSession = config.sessions.getInfo();
          const result = Object.entries(newSession).some(([, session]) => session.username === 'pen');
          assert.ok(!result);
          done(err);
        });
    });

  });

  describe('When session does not exist', () => {
    it('Should not post the comment when user session is not present', (done) => {
      const config = createConfig();
      const handler = initializeApp(config);

      request(handler)
        .post('/comments')
        .set('Cookie', 'sessionId=1')
        .send('username=pen')
        .expect(302)
        .expect('Location', '/login', done);
    });

    it('Should not post the comment when cookie is not present', (done) => {
      const config = createConfig('create-session');

      const handler = initializeApp(config);

      request(handler)
        .post('/comments')
        .send('username=pen')
        .expect(302)
        .expect('Location', '/login', done);
    });
  });

});