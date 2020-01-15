const Course = require('../models/Course');

exports.getAllCourse = (req, res) => {
    console.log('get all course called');
    res.send(Course.getAllCourse());
};

exports.createCourse = (req, res, next) => {
    console, log('create course called');
};

