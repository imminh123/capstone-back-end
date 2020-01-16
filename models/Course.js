const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: String,
    courseCode: {type: String, unique: true},
    category: String,
    shortDes: String,
    fullDes: String,
    skill: Array,
    dateCreated: String
});

const Course = mongoose.model('courses', courseSchema);
module.exports = Course;


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