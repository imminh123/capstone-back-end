const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FAQSchema = new Schema({
    teacherID: {type: Schema.Types.ObjectId, ref: 'teacher'},
    askID: {type:Schema.Types.ObjectId, ref: 'ask'},
    scannedContent: {type: String, required: true},
    askContent: {type: String, required: true},
    answer: {type: String, required: true}
});

const faq = mongoose.model('faq', FAQSchema);
module.exports = faq;