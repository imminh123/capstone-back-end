const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userID: {type: String, required: true},
    ask: {type:Schema.Types.ObjectId,ref: 'ask'},
    message: {type: String, require: true},
    dateCreated: {type: String}
});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;