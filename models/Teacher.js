const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    teacherName: {type: String, required:true},
    email:{type:String,require:true},
    rating:{
        star_1:{type:Number},
        star_2:{type:Number},
        star_3:{type:Number},
        star_4:{type:Number},
        star_5:{type:Number}
    },
    courses:[{type:Schema.Types.ObjectId,ref:'courses'}],
    gender: {type: String, required:true},
    avatar: {type:String},
    isActive:Boolean
});

const Teacher = mongoose.model('teachers', teacherSchema);
module.exports = Teacher;
