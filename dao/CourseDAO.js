const mongoose = require('mongoose');
const Course = require('../models/Course');
exports.getAllCourse = async function () {
    const x = await Course.find({});
    console.log(x);
    return JSON.stringify(x);
};
