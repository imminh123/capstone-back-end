const request = require('supertest');
const app = require('../app.js');
var async = require("async");

describe('1 GET /randomURL', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/randomURL')
      .expect(404, done);
  });
});

describe('2 GET /getDepartment/111111111111111111111111', () => {
  it('Input nonexistent ID should return error: Department not found', (done) => {
    request(app)
      .get('/getDepartment/111111111111111111111111')
      .expect(200)
      .expect('{"error":"Department not found"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('3 Delete /deleteDepartment/111111111111111111111111', () => {
  it('Delete nonexistent ID should return error: Department not found', (done) => {
    request(app)
      .delete('/deleteDepartment/111111111111111111111111')
      .expect(200)
      .expect('{"error":"Department not found"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('4 Create /createDepartment', () => {
  let data = {
    "name": "Test"
}
  it('Create new department should return success and new department detail', (done) => {
    request(app)
      .post('/createDepartment')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.department.name=="Test";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('5 Create /createDepartment', () => {
  let data = {
    "name": "Test",
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

describe('6 GET /getDepartment/', () => {
  it('should return department detail name=Test', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allDepartment')
          .end((err,res)=>{
              i=0;
              do {
                testID=res.body[i]._id;
              } while (res.body[i].name!='Test');
              fun();
            })
          },
      function(fun){
        request(app)
        .get('/getDepartment/'+testID)
        .expect(200)
        .expect(response => {
          response.body.department.name=="Test";
         })
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});

describe('7 Update /updateDepartment/', () => {
  let data = {
    "name": "Test"
  }
  it('Update department should return success and new department detail', (done) => {
      async.series([
        function(fun){
          request(app)
            .get('/allDepartment')
            .end((err,res)=>{
                i=0;
                do {
                  testID=res.body[i]._id;
                } while (res.body[i].name!='Test');
                fun();
              })
            },
        function(fun){
          request(app)
          .put('/updateDepartment/'+testID)
          .send(data)
          .expect(200)
          .expect(response => {
            response.body.success="Update successfully";
            response.body.department.name=="Test";
          })
          .end((err) => {
            if (err) return done(err);
            fun();
      })}
        ],done);
    });
});

describe('8 Update /updateDepartment/111111111111111111111111', () => {
  let data = {
    "name": "Test",
  }
  it('Update nonexistent department should return error', (done) => {
    request(app)
      .put('/updateDepartment/111111111111111111111111')
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

describe('9 Update /updateDepartment/5e6b015da688e30488848895', () => {
  let data = {
    "name": "Test"
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

describe('10 Delete /deleteDepartment/', () => {
  it('Delete department should return success', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allDepartment')
          .end((err,res)=>{
            i=0;
                do {
                  testID=res.body[i]._id;
                } while (res.body[i].name!='Test');
                fun();
              })
          },
      function(fun){
        request(app)
        .delete('/deleteDepartment/'+testID)
        .expect(200)
        .expect('{"success":"Delete successfully"}')
        .end((err) => {
          if (err) return done(err);
          fun();
        });
      }
    ],done);
  });
});

describe('11 GET /searchFAQ?detail=DBI&page=1', () => {
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

describe('12 GET /allDepartment', () => {
  it('Get all departent should return status 200', (done) => {
    request(app)
      .get('/allDepartment')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('13 Get /getCourseOfDepartment/', () => {
  it('Get course of department should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allDepartment')
          .end((err,res)=>{
                  testID=res.body[0]._id;
                fun();
              })
          },
      function(fun){
        request(app)
        .get('/getCourseOfDepartment/'+testID)
        .expect(200)
        .end((err) => {
          if (err) return done(err);
          fun();
        });
      }    
    ],done);
  });
});

describe('14 GET /getStatisticNumber', () => {
  it('Get Statistic number should return number of teacher, active teacher and course', (done) => {
    request(app)
      .get('/getStatisticNumber')
      .expect(200)
      .expect(response => {
        response.body.numOfTeacher!='';
        response.body.numOfCourse!='';
        response.body.numOfActiveTeacher!='';
      })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('15 GET /getReport', () => {
  it('Get report should return code 200', (done) => {
    request(app)
      .get('/getReport?teacher=&course=&from=&to=')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('16 Create /createcourse', () => {
  let data = {
    "courseName": "Test",
    "courseCode": "Test",
    "departments": ["Test"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "Test",
    "teachers": []
}
  it('Create new course with non-exist department name should return error', (done) => {
    request(app)
      .post('/createcourse')
      .send(data)
      .expect(200)
      .expect('{"error":"Department not found"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('17 Create /createcourse', () => {
  let data = {
    "courseName": "Test",
    "courseCode": "Test",
    "departments": ["Test"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "https://www.coursera.org/learn/python-basics",
    "teachers": []
}
  it('Create new course with existed url should return error', (done) => {
    request(app)
      .post('/createcourse')
      .send(data)
      .expect(200)
      .expect('{"error":"New code or url already existed"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('18 Create /createcourse', () => {
  let data = {
    "courseName": "Test",
    "courseCode": "Other",
    "departments": ["Test"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "Test",
    "teachers": []
}
  it('Create new course with code = Other should return error', (done) => {
    request(app)
      .post('/createcourse')
      .send(data)
      .expect(200)
      .expect('{"error":"Course code cannot not be Other"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('19 Create /createcourse', () => {
  let data = {
    "courseName": "Test",
    "courseCode": "Test",
    "departments": ["Science"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "Test",
    "teachers": []
}
  it('Create new course should return success', (done) => {
    request(app)
      .post('/createcourse')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.success=="Create successfully";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('20 GET /searchcourse?page=1&limit=2&detail=test', () => {
  it('should return search result contain course code = test', (done) => {
    request(app)
      .get('/searchcourse?page=1&limit=2&detail=test')
      .expect(200)
      .expect(response => {
        response.body.totalPage=="1";
        response.body.result[0].courseCode=="Test";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('21 Update /updatecourse/111111111111111111111111', () => {
  let data = {
    "courseName": "Test",
    "courseCode": "Other",
    "departments": ["Science"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "Test",
    "teachers": []
}
  it('Update department with non existed ID should return error', (done) => {
    request(app)
      .put('/updateDepartment/111111111111111111111111')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.error="Course not found";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('22 Update /updatecourse/5e6b1c0fa82351000474ce9a', () => {
  let data = {
    "courseName": "Test",
    "courseCode": "Other",
    "departments": ["Science"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "Test",
    "teachers": []
}
  it('Update course code = Other should return error', (done) => {
    request(app)
      .put('/updateDepartment/5e6b1c0fa82351000474ce9a')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.error="Course code cannot not be Other";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('23 Update /updatecourse/5e6b1c0fa82351000474ce9a', () => {
  let data = {
    "courseName": "Test",
    "courseCode": "Test",
    "departments": ["Test"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "Test",
    "teachers": []
}
  it('Update with non existed department should return error', (done) => {
    request(app)
      .put('/updateDepartment/5e6b1c0fa82351000474ce9a')
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

describe('24 Update /updatecourse/5e6b1c0fa82351000474ce9a', () => {
  let data = {
    "courseName": "Test",
    "courseCode": "Test",
    "departments": ["Test"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "https://www.coursera.org/learn/python-basics",
    "teachers": []
}
  it('Update with existed url should return error', (done) => {
    request(app)
      .put('/updateDepartment/5e6b1c0fa82351000474ce9a')
      .send(data)
      .expect(200)
      .expect(response => {
        response.body.error="New code or url already existed";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('25 Update /updatecourse/', () => {
   let data = {
    "courseName": "Test",
    "courseCode": "Test",
    "departments": ["Science"],
    "shortDes": "Test",
    "fullDes": "Test",
    "courseURL": "Test",
    "teachers": []
}
  it('Update should return success', (done) => {
      async.series([
        function(fun){
          request(app)
            .get('/allcourses')
            .end((err,res)=>{
                i=0;
                do {
                  testID=res.body[i]._id;
                } while (res.body[i].courseCode!='Test');
                fun();
              })
            },
        function(fun){
          request(app)
          .put('/updatecourse/'+testID)
          .send(data)
          .expect(200)
          .expect(response => {
            response.body.success="Update successfully";
          })
          .end((err) => {
            if (err) return done(err);
            fun();
      })}
        ],done);
    });
});

describe('26 GET /allcourses', () => {
  it('Get all courses should return code 200', (done) => {
    request(app)
      .get('/allcourses')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('27 Delete /deletecourse/', () => {
  it('Delete course should return success', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allcourses')
          .end((err,res)=>{
            i=0;
                do {
                  testID=res.body[i]._id;
                } while (res.body[i].courseCode!='Test');
                fun();
              })
          },
      function(fun){
        request(app)
        .delete('/deletecourse/'+testID)
        .expect(200)
        .expect('{"success":"Delete successfully"}')
        .end((err) => {
          if (err) return done(err);
          fun();
        });
      }
    ],done);
  });
});

describe('28 GET /allteachers', () => {
  it('Get all teacher should return code 200', (done) => {
    request(app)
      .get('/allteachers')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('29 GET /getteacher/111111111111111111111111', () => {
  it('Input nonexistent ID should return error: Teacher not found', (done) => {
    request(app)
      .get('/getteacher/111111111111111111111111')
      .expect(200)
      .expect('{"error":"Teacher not found"}')
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('30 GET /getteacher/', () => {
  it('should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allteachers')
          .end((err,res)=>{
                testID=res.body[0]._id;
              fun();
            })
          },
      function(fun){
        request(app)
        .get('/getteacher/'+testID)
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});

describe('31 GET /getTeacherDashboard/', () => {
  it('should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allteachers')
          .end((err,res)=>{
                testID=res.body[0]._id;
              fun();
            })
          },
      function(fun){
        request(app)
        .get('/getTeacherDashboard/'+testID)
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});

describe('32 GET /getAllFolder', () => {
  it('Get all folder should return code 200', (done) => {
    request(app)
      .get('/getAllFolder')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('33 GET /allask', () => {
  it('Get all ask should return code 200', (done) => {
    request(app)
      .get('/allask')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('34 GET /getAllFAQ?page=1', () => {
  it('Get all faq should return code 200', (done) => {
    request(app)
      .get('/getAllFAQ?page=1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('35 GET /getFAQbyFilter/?teacherID=&courseCode=&page=1', () => {
  it('Get faq by filter should return code 200', (done) => {
    request(app)
      .get('/getFAQbyFilter/?teacherID=&courseCode=&page=1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('36 GET /allStudent', () => {
  it('Get faq by filter should return code 200', (done) => {
    request(app)
      .get('/allStudent')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('37 GET /getFAQ/', () => {
  it('getFAQ should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/getAllFAQ?page=1')
          .end((err,res)=>{
                testID=res.body.result[0]._id;
              fun();
            })
          },
      function(fun){
        request(app)
        .get('/getFAQ/'+testID)
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});

describe('38 GET /getCourseForFAQ', () => {
  it('Get course for FAQ should return code 200 with first object is allFAQ', (done) => {
    request(app)
      .get('/getCourseForFAQ')
      .expect(200)      
      .expect(response => {
        response.body[0].courseCode=="All FAQ";
        response.body[0].courseName=="FAQ of all courses";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('39 GET /getAllUser', () => {
  it('getAllUser should return code 200', (done) => {
    request(app)
      .get('/getAllUser')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('40 GET /getUserByID/', () => {
  it('getUserByID should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/getAllUser')
          .end((err,res)=>{
                testID=res.body[0]._id;
              fun();
            })
          },
      function(fun){
        request(app)
        .get('/getUserByID/'+testID)
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});

describe('41 GET /getUserByID/111111111111111111111111', () => {
  it('getAllUser should return code 200', (done) => {
    request(app)
      .get('/getUserByID/111111111111111111111111')
      .expect(200)
      .expect(response => {
        response.body.error=="User not found";
       })
      .end((err) => {
        if (err) return done(err);
        done();
    });
  });
});

describe('42 GET /getstudentbyid/', () => {
  it('getstudentbyid should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allStudent')
          .end((err,res)=>{
                testID=res.body[0]._id;
              fun();
            })
          },
      function(fun){
        request(app)
        .get('/getstudentbyid/'+testID)
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});

describe('43 GET /getStudentStatistic/', () => {
  it('getStudentStatistic should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allStudent')
          .end((err,res)=>{
                testID=res.body[0]._id;
              fun();
            })
          },
      function(fun){
        request(app)
        .get('/getStudentStatistic/'+testID)
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});

describe('44 GET /getCourseOfStudent/', () => {
  it('getCourseOfStudent should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allStudent')
          .end((err,res)=>{
                testID=res.body[0]._id;
              fun();
            })
          },
      function(fun){
        request(app)
        .get('/getCourseOfStudent/'+testID)
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});

describe('45 GET /exitCourse/', () => {
  it('exitCourse should return code 200', (done) => {
    async.series([
      function(fun){
        request(app)
          .get('/allStudent')
          .end((err,res)=>{
                testID=res.body[0]._id;
              fun();
            })
          },
      function(fun){
        request(app)
        .put('/exitCourse/'+testID+'/111111111111111111111111')
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              fun();
            })
          }
      ],done);
  });
});