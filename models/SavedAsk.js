const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedAskSchema = new Schema({
    teacherID: {type: Schema.Types.ObjectId, ref: 'teacher'},
    askID: [{type:Schema.Types.ObjectId, ref: 'ask'}]
});

const savedAsk = mongoose.model('savedAsk', savedAskSchema);
module.exports = savedAsk;