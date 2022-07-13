const request = require('supertest');
const { app } = require('../src/app.js');

describe('App test', () => {
  const handler = app('./public');
  it('Should respond as the url not found', (done) => {
    request(handler)
      .get('/notFound')
      .expect(404, done);
  });

  describe('Should serve the static pages', () => {
    it('GET /flowerCatalog.html', (done) => {
      request(handler)
        .get('/flowerCatalog.html')
        .expect('Content-type', 'text/html')
        .expect(200)
        .end(done);
    });
    it('GET /abeliophyllum.html', (done) => {
      request(handler)
        .get('/abeliophyllum.html')
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

  it('Should redirect to guestBook page of successful login', (done) => {
    request(handler)
      .post('/login')
      .send('username=pen')
      .expect(302)
      .expect('location', '/comments', done);
  });

  it('Should redirect to login page when login is unsuccessful', (done) => {
    request(handler)
      .post('/login')
      .send('username=')
      .expect(302)
      .expect('location', '/loginPage.html', done);
  });

  it('Should display comments page with exisiting comments', (done) => {
    request(handler)
      .get('/comments')
      .expect(200, done);
  });

});
