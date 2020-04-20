const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FAQCounter = new Schema({
    number: {type:Number,default:0}
});

const faqCounter = mongoose.model('faqcounter', FAQCounter);
module.exports = faqCounter;