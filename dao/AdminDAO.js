var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
    
}

exports.createAdmin = async function(adminName,email,gender,avatar){

    var admin=await Admin.findOne({email:email});
    if (!(admin==null||admin=='')) return makeJson('error','Email already existed');

    admin = new Admin({
        name:adminName,
        email:email,
        gender:gender,
        avatar:avatar
    });
    await admin.save();

    return admin;

}

//get number of teacher, course, and active teacher
exports.getAllNumber = async function () {

    var newObject = '{"numOfTeacher":'+await Teacher.count({})
                        +',"numOfCourse":'+await Course.count({})
                        +',"numOfActiveTeacher":'+await Teacher.count({isActive:true})+'}';

    return JSON.parse(newObject);

}

async function reportOfCourse(course,teacherID,asks,teacher,allAnswered,allUnanswered,averageRating){

    var rating=0,answered=0,count=0;

    for (ask of asks) {
        if (ask.courseID==course._id) {
            count++;
            if (ask.isClosed) {
                rating+=ask.rating;
                answered++;
            }
        }
    }

    rating=rating/answered;
    var newOb={
        teacherName:teacher.name,
        teacherEmail:teacher.email,
        allAnswered:allAnswered,
        allUnanswered:allUnanswered,
        averageRating:averageRating,
        courseName:course.courseName,
        courseCode:course.courseCode,
        averageOfCourse:rating,
        answered:answered,
        unanswered:count-answered,
    }

    return newOb;

}

exports.getReport = async function(teachers,courses,startDate,endDate){

    var result=[];
    
    var coursesdetail=[];

    for (courseID of courses) {
        if (courseID!='') {
            var course=await Course.findById(courseID).select('courseName courseCode');
            if (course==null||course=='') return makeJson('error','courseID not found');    
            coursesdetail.push(course);
            }
        else {
            coursesdetail.push({
                _id:'',
                courseName:'Other',
                courseCode:'Other'
            })
        }
    }

    var asks=await Ask.find({teacher:teachers});
    asks = asks.filter(function(value, index, arr){
        return Date.parse(value.dateCreated)>=Date.parse(startDate)
                && Date.parse(value.dateCreated)<=Date.parse(endDate) 
                && courses.includes(value.courseID);
    });

    for (teacherID of teachers) {

        var teacher = await Teacher.findById(teacherID);
        var answered=0,rating=0;
        
        var teacherasks=asks.filter(function(value){
            return value.teacher==teacherID;
        });

        for (ask of teacherasks){
            if (ask.isClosed) {
                answered++;
                rating+=ask.rating;
            }
        }
        rating=rating/answered;
  
        for (course of coursesdetail) {
                result.push(await reportOfCourse(course,teacherID,teacherasks,teacher,answered,teacherasks.length-answered,rating));
        }

    }

    return result;

}