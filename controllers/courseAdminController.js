const CourseDAO = require('../dao/CourseDAO');

exports.getAllCourse = async (req, res) => {
    console.log('get all course called');
    res.send(await CourseDAO.getAllCourse());
};

exports.getCourseByCode = async (req,res) => {
    var code=req.params['code'];
    console.log('get course by code '+code);
    res.send(await CourseDAO.getCourseByCode(code));
};

exports.createCourse = (req, res, next) => {
    console, log('create course called');
    res.send("Hello");
};

