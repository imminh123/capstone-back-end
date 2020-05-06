const request = require('supertest');
const app = require('../app.js');

describe('GET /getDepartment/5e6b0137a688e30488848894', () => {
  it('should return department detail', (done) => {
    request(app)
      .get('/getDepartment/5e6b0137a688e30488848894')
      .expect(200, done);
  });
});

describe('GET /getDepartment/5e6b0137a688e30488848895', () => {
  it('Input nonexistent ID should return error: Department not found', (done) => {
    request(app)
      .get('/getDepartment/5e6b0137a688e30488848895')
      .expect(200, done);
  });
});

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});
