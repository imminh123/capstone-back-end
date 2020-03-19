var Objectid = require('mongodb').ObjectID;
const Student = require('../models/Student');
const Course = require('../models/Course');
const Note = require('../models/Note');
const Highlight = require('../models/Highlight');
const Ask = require('../models/Ask');

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.createStudent = async function(name,email,gender,avatar){
    var student = await Student.findOne({email:email});
    
    if (!(student==null||student=='')) return {error : "There's an existing email"};

    student = new Student({
        name:name,
        code:email,
        email:email,
        courses:[],
        gender:gender,
        avatar:avatar
    });
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

exports.allStudent = async function(){
    var students=await Student.find();
    return students;
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

exports.getStudentStatistic=async function(sID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    var notes=await Note.find({studentID:sID});
    var hls=await Highlight.find({studentID:sID});
    var asks=await Ask.find({student:sID});
    var result={
        noteNumber:notes.length,
        highlightNumber:hls.length,
        askNumber:asks.length
    }
    return result;
}