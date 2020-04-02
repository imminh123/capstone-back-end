var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Folder = require('../models/Folder');
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

function averageRating(asks){

    var rating=0,count=0;

    for (ask of asks) {
        if (ask.isClosed) {
            rating+=ask.rating;
            count++;
        }
    }

    return rating/asks.length;

}

function reportOfCourse(courseID,asks){



}

exports.getReport = async function(teachers,courses,startDate,endDate){
    var result=[],newOb;

    for (courseID of courses) {
        if (courseID!='Other') {
            var course = await Course.findById(courseID);
            if (course==null||course=='') return makeJson('error','courseID not found');
        }
    }

    for (teacherID of teachers) {

        var teacher = await Teacher.findById(teacherID);
        var asks=await Ask.find({teacher:teachers,isClosed:true});

        asks = asks.filter(function(value, index, arr){
            return Date.parse(value.dateModified)>=Date.parse(startDate)
                    && Date.parse(value.dateModified)<=Date.parse(endDate);
        });

        newOb={
            teacherName:teacher.name,
            teacherEmail:teacher.mail,
            numberOfAsk:asks.length,
            avarageRating:averageRating(asks),
            courses:[]
        }
  
        for (course of courses) {
                newOb.courses.push(reportOfCourse(course,asks));
        }

        result.push(newOb);
    
    }

    return result;

}