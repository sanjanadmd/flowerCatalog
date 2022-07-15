const request = require('supertest');

const { app } = require('../src/app.js');

describe('App test', () => {
  const handler = app();
  it('Should respond with 404 when url not found', (done) => {
    request(handler)
      .get('/notFound')
      .expect(404, done);
  });

  describe('GET request of files on public directory ', () => {
    it('Should serve index page( "/" )', (done) => {
      request(handler)
        .get('/flowerCatalog.html')
        .expect('Content-type', 'text/html; charset=UTF-8')
        .expect(200)
        .end(done);
    });

    it('Should serve html page( "/flowerCatalog.html" )', (done) => {
      request(handler)
        .get('/flowerCatalog.html')
        .expect('Content-type', 'text/html; charset=UTF-8')
        .expect(200)
        .end(done);
    });

    it('Should serve document from docs ( "/docs/Abeliophyllum.pdf" )', (done) => {
      request(handler)
        .get('/docs/Abeliophyllum.pdf')
        .expect('Content-type', 'application/pdf')
        .expect(200)
        .end(done);
    });

    it('Should serve image from images ( "/images/freshorigins.jpeg" )', (done) => {
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
