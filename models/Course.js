const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: {type: String, required:true},
    courseCode: {type: String, unique: true, required:true},
    category: {type: String, required:true},
    shortDes: {type: String, required:true},
    fullDes: {type: String, required:true},
    skill: {type: Array, required:true},
    dateCreated: {type: String, required:true}
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