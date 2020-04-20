const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FAQSchema = new Schema({
    number: {type: Number},
    askID: {type:Schema.Types.ObjectId, ref: 'ask'},
    courseCode: {type: String},
    teacherID: {type: Schema.Types.ObjectId, ref: 'teacher'},
    scannedContent: {type: String, required: true},
    askContent: {type: String, required: true},
    answer: {type: String, required: true}
});

const faq = mongoose.model('faq', FAQSchema);
module.exports = faq;