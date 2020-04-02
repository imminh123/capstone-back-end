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

function averageRating(teacherID,asks){

    var rating=0,count=0;

    for (ask of asks) {
        if (ask.isClosed && ask.teacher==teacherID) {
            rating+=ask.rating;
            count++;
        }
    }

    return rating/count;

}

async function reportOfCourse(course,teacherID,asks){

    var rating=0,answered=0,count=0;

    for (ask of asks) {
        if (ask.courseID==course._id && ask.teacher==teacherID) {
            count++;
            if (ask.isClosed) {
                rating+=ask.rating;
                answered++;
            }
        }
    }

    rating=rating/answered;

    var reportOfCourse = {
        courseName:course.courseName,
        courseCode:course.courseCode,
        averageRating:rating,
        answered:answered,
        unanswered:count-answered
    }

    return reportOfCourse;

}

exports.getReport = async function(teachers,courses,startDate,endDate){

    var result=[],newOb;
    
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

    for (teacherID of teachers) {

        var teacher = await Teacher.findById(teacherID);
        var answered=0;
        asks = asks.filter(function(value, index, arr){
            if (value.isClosed) answered++;
            return Date.parse(value.dateCreated)>=Date.parse(startDate)
                    && Date.parse(value.dateCreated)<=Date.parse(endDate) 
                    && courses.includes(value.courseID);
        });

        newOb={
            teacherName:teacher.name,
            teacherEmail:teacher.mail,
            answered:answered,
            unanswered:asks.length-answered,
            avarageRating:averageRating(teacherID,asks),
            courses:[]
        }
  
        for (course of coursesdetail) {
                newOb.courses.push(await reportOfCourse(course,teacherID,asks));
        }

        result.push(newOb);
    
    }

    return result;

}