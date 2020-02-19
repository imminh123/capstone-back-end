const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: {type: String, required:true},
    courseCode: {type: String, unique: true, required:true},
    category: [{
        name:{type:String},
        displayName:{type:String}
        }],
    shortDes: {type: String, required:true},
    fullDes: {type: String, required:true},
    courseURL: {type: String, required:true},
    dateCreated: {type: String, required:true},
    teacher: [{
        teacherID: {type:Schema.Types.ObjectId,unique:true,ref: 'teachers'}
        }]
});

const Course = mongoose.model('courses', courseSchema);
module.exports = Course;