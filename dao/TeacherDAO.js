const mongoose = require('mongoose');
var Objectid = require('mongodb').ObjectID;
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

exports.getAllTeacher = async function () {
    var teacherlist = await Teacher.find({}).populate('courses');
    // console.log("teacher list: "+teacherlist);
    return teacherlist;
};

exports.getTeacherByID = async function(id){
    try{
        id = Objectid(id);
        var teacher = await Teacher.findOne({_id:id}).populate('courses');
        // console.log("teacher: "+teacher);
        return teacher;
    }catch{
        return null;
    }
};

exports.updateTeacher = async function(id,name,email,courses,isActive){
    try{
        id=Objectid(id);
        // console.log("teacherid "+id);
        var teacher = await Teacher.find({_id:id});
        if (teacher==null) return 0;
        await Teacher.updateOne({_id:id},{teacherName:name,email:email,courses:courses,isActive:isActive});
        //remove this teacher from every course
        // console.log("start removing teacher from course");
        await Course.updateMany(
            {},
            {$pull: {teachers: id}},
            {safe: true, upsert: true},
            function(err, doc) {
                if(err){
                    // console.log(err);
                    return -1;
                }else{
                //do stuff
                }
            }
        );
        //add this teacher to new course
        // console.log("start adding teacher");
        courses.forEach(async function(data){
            var courseid=Objectid(data);
            // console.log("courseid is "+courseid);
            await Course.updateOne({_id:courseid},
                {$addToSet: {teachers:id}},
                {safe: true, upsert: true},
                function(err, doc) {
                    if(err){
                        // console.log(err);
                        return -1;
                    }else{
                    //do stuff
                    }
                }
            );
        });
        return 1;
    }catch{
        return -1;
    }
};

exports.changeteacherisactive = async function(id,isActive){
    try{
        id=Objectid(id);
        var teacher=await Teacher.find({_id:id});
        if (teacher==null) return 0;
        await Teacher.updateOne({_id:id},{isActive:isActive});
        return 1;
    }
    catch{
        return -1;
    }
}

exports.searchTeacher = async function(page,perPage,detail){
    var result,size;
    result = await Teacher.find({$or:[{teacherName:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}, 
                            // {"teacherName":1,"email":1,"rating":1},
                            function(err, docs) {
                                // console.log("search "+docs);
                                if (err) handleError(err);
                                });
    // console.log(result);
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    if (page!=0){
        result = await Teacher.find({$or:[{teacherName:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}, 
                            // {"teacherName":1,"email":1,"rating":1},
                            function(err, docs) {
                                // console.log("search "+docs);
                                if (err) handleError(err);
                                })
                                .skip(perPage*(page-1))
                                .limit(Number(perPage));
    }
    // console.log(result);
    result=JSON.stringify(result);
    result='{"totalPage":'+size+',"result":'+result+'}';
    return result;
}