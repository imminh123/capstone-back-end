const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const admin = require('../models/Admin');

const courseSchema = new Schema({
    courseName: String,
    courseCode: String,
    category: String,
    shortDes: String,
    fullDes: String,
    skill: Array,
    dateCreated: String
});

const Course = mongoose.model('Courses', courseSchema);
module.exports = Course;

function getAllCourse() {
    var courses = mongoose.Collection("Courses");
    courses.find({}).toArray(function (err, data) {
        if (err) throw err;
        console.log(data);
    });
    return courses;
};

/**
 * courseName
 * courseCode
 * category
 * shortDes
 * fullDes
 * dateCreated
 * creator
 * skill: array of string
 */