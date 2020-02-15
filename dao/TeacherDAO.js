const mongoose = require('mongoose');
var Objectid = require('mongodb').ObjectID;
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

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


exports.updateTeacher = async function(id,name,email,course){
    id=Objectid(id);
    var teacher = await Teacher.find({_id:id});
    if (teacher==null) return 0;
    await Teacher.updateOne({_id:id},{teacherName:name,email:email,course:course});
    //remove this teacher from every course
    console.log("start removing teacher");
    await Course.updateMany(
        {},
        {$pull: {teacher: {teacherID:id}}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
            //do stuff
            }
        }
    );
    //add this teacher to new course
    console.log("start adding teacher");
    course.forEach(async function(data){
        var courseid=Objectid(data.courseID);
        console.log(courseid);
        await Course.updateOne({_id:courseid},
            {$push: {teacher: {teacherID:id}}},
            {safe: true, upsert: true},
            function(err, doc) {
                if(err){
                console.log(err);
                }else{
                //do stuff
                }
            }
        );
    });
}