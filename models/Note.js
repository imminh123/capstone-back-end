const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    folderID: {type: Schema.Types.ObjectId, required:true},
    studentID: {type: Schema.Types.ObjectId, required:true},
    text: [{type:String}],
    description: {type: String},
});

const Note = mongoose.model('notes', noteSchema);
module.exports = Note;