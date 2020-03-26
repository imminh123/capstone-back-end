const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const askStatusSchema = new Schema({
    askID: {type: Schema.Types.ObjectId, ref: 'ask'},
    studentStatus: {type: String}, 
    teacherStatus: {type: String}
});

const AskStatus = mongoose.model('askstatus', askStatusSchema);
module.exports = AskStatus;