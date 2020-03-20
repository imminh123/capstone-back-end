const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    studentID: {type: Schema.Types.ObjectId, required:true},
    course: {type: Schema.Types.ObjectId, require: true, ref: 'course'},
    scannedContent: {type:String},
    description: {type: String},
    url: {type:String, required:true},
    index: {type:Number, required:true},
    dateModified: {type:String},
    isPinned: {type: Boolean, default: false}
});

const Note = mongoose.model('note', noteSchema);
module.exports = Note;