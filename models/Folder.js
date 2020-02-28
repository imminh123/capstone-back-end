const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    folderName: {type: String, required:true},
    studentID : {type:Schema.Types.ObjectId, ref: 'students'},
    notes: [{type:Schema.Types.ObjectId,ref: 'notes'}]
});

const Folder = mongoose.model('folders', folderSchema);
module.exports = Folder;