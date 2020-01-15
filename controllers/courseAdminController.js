const CourseDAO = require('../dao/CourseDAO');

exports.getAllCourse = async (req, res) => {
    console.log('get all course called');
    res.send(await CourseDAO.getAllCourse());
};

exports.createCourse = (req, res, next) => {
    console, log('create course called');
};

