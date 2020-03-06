const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userID: {type: String, required: true},
    ask: {type:Schema.Types.ObjectId,ref: 'asks'},
    message: {type: String, require: true},
    dateCreated: {type: String, required:true}
});

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;