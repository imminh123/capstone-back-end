const mongoose = require('mongoose');
var Objectid = require('mongodb').ObjectID;
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

exports.getAllTeacher = async function () {
    const teacherlist = await Teacher.find({}).populate('courses.courseID');
    console.log("teacher list: "+teacherlist);
    return JSON.stringify(teacherlist);
};

exports.getTeacherByID = async function(id){
    id = Objectid(id);
    const teacher = await Teacher.findOne({_id:id}).populate('courses.courseID');
    console.log("teacher: "+teacher);
    return JSON.stringify(teacher);
};


exports.updateTeacher = async function(id,name,email,courses){
    id=Objectid(id);
    var teacher = await Teacher.find({_id:id});
    if (teacher==null) return 0;
    await Teacher.updateOne({_id:id},{teacherName:name,email:email,courses:courses});
    //remove this teacher from every course
    console.log("start removing teacher from course");
    await Course.updateMany(
        {},
        {$pull: {teachers: {teacherID:id}}},
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
    courses.forEach(async function(data){
        var courseid=Objectid(data.courseID);
        console.log(courseid);
        await Course.updateOne({_id:courseid},
            {$addToSet: {teachers: {teacherID:id}}},
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
};

exports.searchTeacher = async function(page,perPage,detail){
    console.log('DAO '+page+perPage+detail);
    var result = await Teacher.find({$or:[{teacherName:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}, 
                {"teacherName":1,"email":1,"rating":1},
                function(err, docs) {
                    console.log("search "+docs);
                    if (err) handleError(err);
                    })
        .skip(perPage*(page-1))
        .limit(Number(perPage));
    return result;
}