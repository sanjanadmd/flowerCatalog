const request = require('supertest');
const assert = require('assert');

const { initializeApp } = require('../src/app.js');

const { Comments } = require('../src/handlers/comments.js');
const { Sessions } = require('../src/handlers/sessions.js');

const createSetup = () => {
  const config = {
    dirPath: './public', aliases: { '/': '/flowerCatalog.html' }
  };
  const identity = () => { };
  const guestBook = new Comments('', identity, identity);
  const sessions = new Sessions();
  return { sessions, config, guestBook };
}

describe('Initialize App', () => {
  let setup, handler;

  beforeEach(() => {
    setup = createSetup();
    handler = initializeApp(setup);
  })

  it('Should create a session when user is not present', (done) => {
    request(handler)
      .post('/login')
      .send('username=pen')
      .expect(302)
      .expect('Location', '/comments')
      .end((err) => {
        const newSession = setup.sessions.getInfo();
        const result = Object.entries(newSession).some(([, session]) => session.username === 'pen');
        assert.ok(result);
        done(err);
      });
  });

  describe('When session exists', () => {
    beforeEach(() => {
      setup = createSetup();
      setup.sessions.add({ username: 'pen', sessionId: 1 })
      handler = initializeApp(setup);
    })

    it('Should post the comment', (done) => {
      request(handler)
        .post('/comments')
        .set('Cookie', 'sessionId=1')
        .expect(201)
        .expect('submitted', done);
    });

    it('Should display comments page with exisiting comments', (done) => {
      request(handler)
        .get('/comments')
        .set('Cookie', 'sessionId=1')
        .expect(200)
        .expect('Content-Type', 'text/html', done);
    });

    it('Should respond with comments with api', (done) => {
      request(handler)
        .get('/api/comments')
        .set('Cookie', 'sessionId=1')
        .expect(200)
        .expect('Content-Type', 'application/json', done);
    });

    it('Should logout from the session', (done) => {
      request(handler)
        .get('/logout')
        .set('Cookie', 'sessionId=1')
        .expect(302)
        .expect('Location', '/flowerCatalog.html')
        .end((err) => {
          const newSession = setup.sessions.getInfo();
          const result = Object.entries(newSession).some(([, session]) => session.username === 'pen');
          assert.ok(!result);
          done(err);
        });
    });

  });

  describe('When session does not exist', () => {
    it('Should not post the comment when cookie is not present', (done) => {
      request(handler)
        .post('/comments')
        .send('username=pen')
        .expect(302)
        .expect('Location', '/login', done);
    });

    beforeEach(() => {
      setup = createSetup();
      handler = initializeApp(setup);
    })

    it('Should not post the comment when user session is not present', (done) => {
      request(handler)
        .post('/comments')
        .set('Cookie', 'sessionId=1')
        .send('username=pen')
        .expect(302)
        .expect('Location', '/login', done);
    });
  });

});