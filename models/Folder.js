const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    studentID: {type: String, required: true},
    courseID: {type: String},
    courseName: {type: String, required:true},
    courseCode: {type: String, required:true}
});

const Folder = mongoose.model('folder', folderSchema);
module.exports = Folder;