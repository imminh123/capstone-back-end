const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const highlightSchema = new Schema({
    studentID: {type: Schema.Types.ObjectId, required: true},
    folderID: {type: Schema.Types.ObjectId, require: true},
    scannedContent: {type: String, required: true},
    index: {type: Number,required: true},
    color: {type: String, required: true},
    dateModified: {type: String, require:true},
    url: {type: String, require:true}
});

const Highlight = mongoose.model('highlight', highlightSchema);
module.exports = Highlight;