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
}