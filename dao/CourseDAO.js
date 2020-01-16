const mongoose = require('mongoose');
const Course = require('../models/Course');
exports.getAllCourse = async function () {
    const courselist = await Course.find({});
    console.log(courselist);
    return JSON.stringify(courselist);
};

exports.getCourseByCode = async function(code){
    const course = await Course.find({courseCode:code});
    console.log(course);
    return JSON.stringify(course);
};

exports.deleteCourse = async function(code){
    await Course.deleteOne({courseCode:code},function(err){
        if (err) {
            console.log(err);
            return 0;
        }
    });
    return 1;
};
