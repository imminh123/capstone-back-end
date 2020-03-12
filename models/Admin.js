const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
	adminName: {type: String, required:true},
    email:{type:String,require:true},
    gender: {type: String, required:true},
    avatar:{type:String}
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;

