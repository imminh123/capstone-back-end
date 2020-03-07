const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const askSchema = new Schema({
    scannedContent: {type: String},
    askContent: {type: String, required: true},
    student: {type: Schema.Types.ObjectId, ref: 'students'},
    teacher: {type:Schema.Types.ObjectId, ref: 'teachers'}, 
    courseURL: {type: String},
    comments: [{type:Schema.Types.ObjectId, ref: 'comments'}],
    dateModified: {type: String, require: true},
    dateCreated: {type: String, required:true}
});

const Ask = mongoose.model('asks', askSchema);
module.exports = Ask;