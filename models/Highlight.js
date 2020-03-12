const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const highlightSchema = new Schema({
    studentID: {type: Schema.Types.ObjectId, required: true},
    courseCode: {type: String},
    text: {type: String, required: true},
    index: {type: Number,required: true},
    color: {type: String, required: true},
    date: {type: String, require:true},
    url: {type: String, require:true},
    tags: [{type:String}]
});

const Highlight = mongoose.model('highlights', highlightSchema);
module.exports = Highlight;