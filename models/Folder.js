const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    studentID : {type:Schema.Types.ObjectId, ref: 'students'},
    folderName: {type: String, required:true},
    notes: [{type:Schema.Types.ObjectId,ref: 'notes'}],
    dateCreated: {type: String, required:true}
});

const Folder = mongoose.model('folders', folderSchema);
module.exports = Folder;