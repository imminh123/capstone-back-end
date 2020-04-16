var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const Note = require('../models/Note');
const Course = require('../models/Course');
const Folder = require('../models/Folder');
const Student = require('../models/Student');
const Highlight = require('../models/Highlight');

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

    id=Objectid(id);
    var student=await Student.findById(id).populate('courses');
    if (student==null||student=='') return makeJson('error','studentID not found');

    return student;
    
}

exports.allStudent = async function(){

    return await Student.find();;

}

exports.updateCourseOfStudent = async function(id,courses){

    id=Objectid(id);
    var student=Student.findById(id);
    if (student==null||student=='') return makeJson('error','studentID not found');

    if (courses==null||courses==undefined) return makeJson('error','Courses null or underfined');

    for (courseID of courses){
        var course=await Course.findById(courseID);
        if (course==null) return makeJson('error','courseID not found');
    }

    await Student.updateOne({_id:id},{courses:courses});

    //create new folder
    for (courseID of courses){
        var folder=await Folder.findOne({studentID:id,courseID:courseID});
        if (folder==null) {
            var course=await Course.findById(courseID);
            var newFolder= new Folder({
                studentID:id,
                courseID:courseID,
                courseName:course.courseName,
                courseCode:course.courseCode
            });
            newFolder.save();
        }
    }

    return makeJson('success','Update successfuly');

}

exports.getStudentStatistic=async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var notes=await Note.find({studentID:studentID});
    var hls=await Highlight.find({studentID:studentID});
    var asks=await Ask.find({student:studentID});

    var result={
        noteNumber:notes.length,
        highlightNumber:hls.length,
        askNumber:asks.length
    }

    return result;

}

exports.allCourseOfStudent = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID).populate('courses');
    if (student==null||student=='') return makeJson('error','studentID not found');

    return student.courses;
    
}

exports.exitCourse = async function(studentID,courseID) {

    studentID=Objectid(studentID);
    var student= await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    await Student.updateOne(
        {_id:studentID},
        {$pull: {courses:courseID}},
        {safe: true, upsert: true}
    );

    student= await Student.findById(studentID).populate('courses');

    return student;

}