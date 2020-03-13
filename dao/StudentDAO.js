var Objectid = require('mongodb').ObjectID;
const Student = require('../models/Student');
const Course = require('../models/Course');

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.createStudent = async function(name,email,gender,avatar){
    var student=await Student.findOne({email:email});
    if (!(student==null||student=='')) return '';
    
    student = new Student({
        studentName:name,
        studentCode:"Not Yet",
        email:email,
        courses:[],
        gender:gender,
        avatar:avatar
    });
    console.log('new student '+student);
    await student.save();
    return student;
}

exports.getStudentByID = async function(id){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','studentID not correct')
    }
        var student=await Student.findById(id).populate('courses');
        if (student==null||student=='') return makeJson('error','studentID not found');
        return student;
    
}

exports.updateCourseOfStudent = async function(id,courses){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','studentID not correct')
    }
        if (courses==null||courses==undefined) return makeJson('Error','Courses null or underfined');
        await Student.updateOne({_id:id},{courses:courses});
        return makeJson('success','Update successfuly');
    
}