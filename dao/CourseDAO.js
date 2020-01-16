const mongoose = require('mongoose');
const Course = require('../models/Course');

async function existed(code){
    const course=await Course.findOne({courseCode:code},function (err){
        if (err) {
            console.log(err);
            return 0;
        }
    });
    console.log("Course tim duoc la: "+course);
    if (course==null) {
        console.log("course return null");
        return 0;
    }
    console.log("course found");
    return 1;
}

exports.getAllCourse = async function () {
    const courselist = await Course.find({});
    console.log(courselist);
    return JSON.stringify(courselist);
};

exports.getCourseByCode = async function(code){
    const course = await Course.find({courseCode:code});
    console.log(course);
    return JSON.stringify(course);
};

exports.deleteCourse = async function(code){
    if (!existed(code)) return 0;
    await Course.deleteOne({courseCode:code},function(err){
        if (err) {
            console.log(err);
            return 0;
        }
    });
    return 1;
};

exports.createCourse = async function(name,code,cate,short,full,skill){
    if (await existed(code)) {
        console.log("create course return 0 mean course already existed");
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
            skill : skill,
            dateCreated: today
        });
        console.log("Course moi la: "+course);
        await course.save();
        return 1;
}

exports.updateCourse = async function(currentcode,name,code,cate,short,full,skill){
    if (await !existed(currentcode)) {
        console.log("current code doesn't exist");
        return 0;
    }
    if (await existed(code)) {
        console.log("new course existed");
        return 1;
    }
    var oldCourse=await Course.findOne({courseCode:currentcode});
    // var date=oldCourse.dateCreated;
    // var newCouse = new Course({
    //     courseName: name,
    //     courseCode: code,
    //     category: cate,
    //     shortDes: short,
    //     fullDes: full,
    //     skill : skill,
    //     dateCreated: date
    // });
    var id=oldCourse._id;
    await Course.updateOne({_id:id},{courseName:name,courseCode:code,category:cate,shortDes:short,fullDes:full,skill:skill});
    return 2;
}