const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentName: {type: String, required:true},
    studentCode: {type: String, required:true},
    email: {type:String, required:true},
    gender: {type: String, required:true},
    avatar: {type:String}
});

const Student = mongoose.model('students', studentSchema);
module.exports = Student;