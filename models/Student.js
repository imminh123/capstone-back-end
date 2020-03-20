const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {type: String, required:true},
    code: {type: String, required:true},
    email: {type:String, required:true},
    courses: [{type:Schema.Types.ObjectId, ref:'course'}],
    gender: {type: String, required:true},
    avatar: {type:String}
});

const Student = mongoose.model('student', studentSchema);
module.exports = Student;