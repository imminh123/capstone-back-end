const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    teacherName: {type: String, required:true},
    email:{type:String,require:true},
    rating:{type:Number},
    courses:[{
        courseID:{type:Schema.Types.ObjectId,ref:'courses'}
    }]
});

const Teacher = mongoose.model('teachers', teacherSchema);
module.exports = Teacher;
