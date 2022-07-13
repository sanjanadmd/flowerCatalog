const request = require('supertest');
const assert = require('assert');

const { app, initializeApp } = require('../src/app.js');

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

describe('App test', () => {
  const handler = app('./public');
  it('Should respond with 404 when url not found', (done) => {
    request(handler)
      .get('/notFound')
      .expect(404, done);
  });

  describe('Should serve the static pages', () => {
    it('GET /', (done) => {
      request(handler)
        .get('/flowerCatalog.html')
        .expect('Content-type', 'text/html')
        .expect(200)
        .end(done);
    });

    it('GET /flowerCatalog.html', (done) => {
      request(handler)
        .get('/flowerCatalog.html')
        .expect('Content-type', 'text/html')
        .expect(200)
        .end(done);
    });

    it('GET /docs/Abeliophyllum.pdf', (done) => {
      request(handler)
        .get('/docs/Abeliophyllum.pdf')
        .expect('Content-type', 'application/pdf')
        .expect(200)
        .end(done);
    });
    it('GET /images/freshorigins.jpeg', (done) => {
      request(handler)
        .get('/images/freshorigins.jpeg')
        .expect('Content-type', 'image/jpeg')
        .expect(200)
        .end(done);
    });
  });

  it('Should redirect to guestBook page when username is provided', (done) => {
    request(handler)
      .post('/login')
      .send('username=pen')
      .expect(302)
      .expect('location', '/comments', done);
  });

  it('Should redirect to login page when username is not provided', (done) => {
    request(handler)
      .post('/login')
      .expect(302)
      .expect('location', '/loginPage.html', done);
  });

});
