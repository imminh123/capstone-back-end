const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: {type: String, required:true},
    courseCode: {type: String, required:true},
    departments: [{type:String}],
    shortDes: {type: String, required:true},
    fullDes: {type: String, required:true},
    courseURL: {type: String, required:true},
    dateCreated: {type: String, required:true},
    teachers: [{type:Schema.Types.ObjectId,ref: 'teacher'}]
});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;