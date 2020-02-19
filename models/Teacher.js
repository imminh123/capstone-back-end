const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    teacherName: {type: String, required:true},
    email:{type:String,require:true},
    rating:{type:Number},
    course:[{
        courseID:{type:Schema.Types.ObjectId,unique:true,ref:'courses'}
    }]
});

const Teacher = mongoose.model('teachers', teacherSchema);
module.exports = Teacher;
