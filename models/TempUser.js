const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempUser = new Schema({
    name: {type: String, required:true},
    email:{type:String,require:true},
    gender: {type: String, required:true},
    avatar: {type:String},
});

const TempUser = mongoose.model('tempuser', tempUser);
module.exports = TempUser;
