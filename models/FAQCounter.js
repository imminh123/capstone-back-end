const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FAQCounter = new Schema({
    number: Number
});

const faqCounter = mongoose.model('faqcounter', FAQCounter);
module.exports = faqCounter;