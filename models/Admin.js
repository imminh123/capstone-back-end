const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema({
	accountName: String,
	name: String
});