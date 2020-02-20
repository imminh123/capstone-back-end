const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentName: {type: String, required:true},
    studentCode: {type: String, unique: true, required:true}
});

const Student = mongoose.model('students', studentSchema);
module.exports = Student;