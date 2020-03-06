const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const askSchema = new Schema({
    scannedContent: {type: String},
    askContent: {type: String, required: true},
    students: [{type: Schema.Types.ObjectId, ref: 'students'}],
    teachers: [{type:Schema.Types.ObjectId,ref: 'teachers'}],
    dateModified: {type: Date, default: Date.now, require: true},
    courseURL: {type: String},
    comments: [{type:Schema.Types.ObjectId, ref: 'comment'}],
    dateCreated: {type: String, required:true}
});

const Ask = mongoose.model('ask', askSchema);
module.exports = Ask;