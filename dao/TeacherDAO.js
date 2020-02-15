const mongoose = require('mongoose');
var Objectid = require('mongodb').ObjectID;
const Teacher = require('../models/Teacher');

exports.getAllTeacher = async function () {
    const teacherlist = await Teacher.find({});
    console.log(teacherlist);
    return JSON.stringify(teacherlist);
};

exports.getTeacherByID = async function(id){
    id = Objectid(id);
    const teacher = await Teacher.find({_id:id});
    console.log(teacher);
    return JSON.stringify(teacher);
};


exports.updateTeacher = async function(id,name){
    id=Objectid(id);
    var teacher = await Teacher.find({_id:id});
    if (teacher==null) return 0;
    await Teacher.updateOne({_id:id},{teacherName:name});
}