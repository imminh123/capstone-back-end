const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const askSchema = new Schema({
    scannedContent: {type: String},
    askContent: {type: String, required: true},
    student: {type: Schema.Types.ObjectId, ref: 'student'},
    teacher: {type:Schema.Types.ObjectId, ref: 'teacher'},
    courseID : {type:String},
    url: {type: String},
    comments: [{type:Schema.Types.ObjectId, ref: 'comment'}],
    dateModified: {type: String, require: true},
    dateCreated: {type: String, required:true},
    studentStatus: {type:String},
    teacherStatus: {type:String},
    rating: {type:Number},
    isClosed: {type:Boolean}
});

const Ask = mongoose.model('ask', askSchema);
module.exports = Ask;