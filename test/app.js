const request = require('supertest');
const app = require('../app.js');

describe('1 GET /randomURL', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/randomURL')
      .expect(404, done);
  });
});

describe('2 GET /getDepartment/5e6b0137a688e30488848894', () => {
  it('should return department detail', (done) => {
    request(app)
      .get('/getDepartment/5e6b0137a688e30488848894')
      .expect(200, done);
  });
});

describe('3 GET /getDepartment/5e6b0137a688e30488848895', () => {
  it('Input nonexistent ID should return error: Department not found', (done) => {
    request(app)
      .get('/getDepartment/5e6b0137a688e30488848895')
      .expect(200)
      .expect('{"error":"Department not found"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});


describe('4 Delete /deleteDepartment/5e6b0137a688e30488848895', () => {
  it('Delete nonexistent ID should return error: Department not found', (done) => {
    request(app)
      .delete('/deleteDepartment/5e6b0137a688e30488848895')
      .expect(200)
      .expect('{"error":"Department not found"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('5 Create /createDepartment', () => {
  let data = {
    "name": "Test",
    "description": "Test"
}
  it('Create new department should return success and new department detail', (done) => {
    request(app)
      .post('/createDepartment')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.department.name=="Test";
        response.body.department.description=="Test";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('6 Create /createDepartment', () => {
  let data = {
    "name": "Test",
    "description": "Test"
}
  it('Create new department with an existed name should return error', (done) => {
    request(app)
      .post('/createDepartment')
      .send(data)
      .expect(200)
      .expect('{"error":"Department name already existed"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('7 Update /updateDepartment/5e6b0137a688e30488848894', () => {
  let data = {
    "name": "Science",
    "description": "Computer Science"
}
  it('Update department should return success and new department detail', (done) => {
    request(app)
      .put('/updateDepartment/5e6b0137a688e30488848894')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.success="Update successfully";
        response.body.department.name=="Science";
        response.body.department.description=="Computer Science";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('8 Update /updateDepartment/5e6b0137a688e30488848895', () => {
  let data = {
    "name": "Science",
    "description": "Computer Science"
}
  it('Update nonexistent department should return error', (done) => {
    request(app)
      .put('/updateDepartment/5e6b0137a688e30488848895')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.error="Department not found";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('9 Update /updateDepartment/5e6b0137a688e30488848894', () => {
  let data = {
    "name": "Test",
    "description": "Test"
}
  it('Update department with existed name should return error', (done) => {
    request(app)
      .put('/updateDepartment/5e6b0137a688e30488848894')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.error="Department name already existed";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('10 GET /searchFAQ?detail=DBI&page=1', () => {
  it('should return list of FAQ', (done) => {
    request(app)
      .get('/searchFAQ?detail=DBI&page=1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});