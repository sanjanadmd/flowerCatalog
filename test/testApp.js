const request = require('supertest');
const { handler } = require('../src/app.js');

describe('App test', () => {
  it('Should respond as the url not found', (done) => {
    request(handler)
      .get('/notFound')
      .expect(404, done);
  });
  it('Should serve the static pages', () => {
    it('FlowerCatalog', (done) => {
      request(handler)
        .get('/flowerCatalog.html')
        .expect('Content-type', 'text/html')
        .expect(200)
        .end(done);
    });
    it('Abeliophyllum page', (done) => {
      request(handler)
        .get('/abeliophyllum.html')
        .expect('Content-type', 'text/html')
        .expect(200)
        .end(done);
    });
    it('Abeliophyllum document', (done) => {
      request(handler)
        .get('/docs/abeliophyllum.html')
        .expect('Content-type', 'application/pdf')
        .expect(200)
        .end(done);
    });
    it('Image', (done) => {
      request(handler)
        .get('/images/abeliophyllum.jpeg')
        .expect('Content-type', 'image/jpeg')
        .expect(200)
        .end(done);
    });
  });
  it('Should redirect to guestBook for successful login', (done) => {
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
      .expect(200, done)
  });

});
