var Objectid = require('mongodb').ObjectID;
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

//get number of teacher, course, and active teacher
exports.getAllNumber = async function () {
    var newObject = '{"numOfTeacher":'+await Teacher.count({})
                        +',"numOfCourse":'+await Course.count({})
                        +',"numOfActiveTeacher":'+await Teacher.count({isActive:true})+'}';
    return JSON.parse(newObject);
};