var Objectid = require('mongodb').ObjectID;
const Student = require('../models/Student');
const Course = require('../models/Course');

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.getStudentByID = async function(id){
    try{
        id=Objectid(id);
        var student=await Student.findById(id).populate('courses');
        return student;
    }catch{
        return makeJson('Error','studentID not correct')
    }
}

exports.updateCourseOfStudent = async function(id,courses){
    try{
        id=Objectid(id);
        if (courses==null||courses==undefined) return makeJson('Error','Courses null or underfined');
        await Student.updateOne({_id:id},{courses:courses});
        return makeJson('Success','Update successfuly');
    }catch{
        return makeJson('Error','studentID not correct')
    }
}