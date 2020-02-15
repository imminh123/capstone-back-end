const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    teacherName: {type: String, required:true},
});

const Teacher = mongoose.model('teachers', teacherSchema);
module.exports = Teacher;
