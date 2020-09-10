const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
	name: {type: String, required:true}
});

const Department = mongoose.model('department', departmentSchema);
module.exports = Department;