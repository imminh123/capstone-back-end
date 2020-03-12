const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    studentID : {type:Schema.Types.ObjectId, ref: 'student'},
    folderName: {type: String, required:true},
    notes: [{type:Schema.Types.ObjectId,ref: 'note'}],
    dateCreated: {type: String, required:true}
});

const Folder = mongoose.model('folder', folderSchema);
module.exports = Folder;