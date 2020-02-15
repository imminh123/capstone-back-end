const mongoose = require('mongoose');
const Course = require('../models/Course');
var Objectid = require('mongodb').ObjectID;

//return all courses list
exports.getAllCourse = async function () {
    const courselist = await Course.find({});
    console.log(courselist);
    return JSON.stringify(courselist);
};

//return course by id
exports.getCourseByID = async function(id){
    id=Objectid(id);
    const course = await Course.find({_id:id});
    console.log(course);
    return JSON.stringify(course);
};

//delete course by id
exports.deleteCourse = async function(id){
    id=Objectid(id);
    await Course.deleteOne({_id:id},function(err){
        if (err) {
            console.log(err);
            return 0;
        }
    });
    return 1;
};

//check if code has already existed
async function existed(id,code){
    const course=await Course.findOne({courseCode:code},function (err){
        if (err) {
            console.log(err);
            return 0;
        }
    });
    console.log("Course found: "+course);
    //if no course was found. Or a course was found but code is unchanged
    if (course==null || course._id==id) {
        console.log("course return null");
        return 0;
    }
    return 1;
}

//create course
exports.createCourse = async function(name,code,cate,short,full,url,teacherid){
    if (await existed(0,code)) {
        console.log("create course return 0 mean course code already existed");
        return 0;
    }
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        var course = new Course({
            courseName: name,
            courseCode: code,
            category: cate,
            shortDes: short,
            fullDes: full,
            courseURL : url,
            dateCreated: today,
            teacherID: teacherid
        });
        console.log("new course is: "+course);
        await course.save();
        //create successfully
        return 1;
}

//update course
exports.updateCourse = async function(id,name,code,cate,short,full,url,teacherid){
    if (await existed(id,code)) {
        console.log("new course code existed");
        return 0;
    }
    id=Objectid(id);
    await Course.updateOne({_id:id},{courseName:name,courseCode:code,category:cate,shortDes:short,fullDes:full,courseURL:url,teacherID:teacherid});
    //update successfully
    return 1;
}