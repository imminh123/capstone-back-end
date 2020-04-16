var Objectid = require('mongodb').ObjectID;
const Note = require('../models/Note');
const Course = require('../models/Course');
const Folder = require('../models/Folder');
const Student = require('../models/Student');
const Highlight = require('../models/Highlight');

function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);

}

exports.getAllFolder = async function(){

    return await Folder.find();

}

exports.getFolderByStudentID = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var folders = await Folder.find({studentID:studentID}).lean();
    var result=[];
    
    for (folder of folders){
        folder.isStudying=false;

        if (folder.courseID!='')
            if (student.courses.includes(folder.courseID))
                folder.isStudying=true;

        result.push(folder);

    }

    return result;

}

exports.getHighlightByFolderID = async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    return await Highlight.find({folderID:folderID});

}

exports.deleteHighlightByFolderID= async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    await Highlight.deleteMany({folderID:folderID});

    return makeJson('success','Delete successfully');

}


exports.getNoteByFolderID = async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    return await Note.find({folderID:folderID});

}

exports.deleteNoteByFolderID= async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    await Note.deleteMany({folderID:folderID});

    return makeJson('success','Delete successfully');

}

exports.createFolder=async function(studentID,courseCode,courseName){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var folders=await Folder.find({studentID:studentID});
    for (folder of folders){
        if (folder.courseName==courseName && folder.courseCode==courseCode) return makeJson('error','Folder existed');
    }

    var folder=new Folder({
        studentID:studentID,
        courseID:'',
        courseCode:courseCode,
        courseName:courseName
    });
    await folder.save();

    var result={
        success:'Create successfully',
        folder
    }

    return result;

}

exports.deleteFolder=async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');
    
    await Highlight.deleteMany({folderID:folderID});
    await Note.deleteMany({folderID:folderID});
    
    if (folder.courseID!=''){
        var student=await Student.findById(folder.studentID);
        if (!student.courses.includes(folder.courseID)) 
            await Folder.deleteOne({_id:folderID});
    }
    else await Folder.deleteOne({_id:folderID});
    
    return makeJson('success','Delete successfully');
    
}

exports.getFolderByURL=async function(studentID,url){

    var courses = await Course.find().populate('teachers');
    var courseOfURL;
    for (course of courses){
        if (url.includes(course.courseURL)) {
            courseOfURL=course;
            break;
        }
    }
    if (courseOfURL==undefined) return makeJson('error','No information found');
    var folder = await Folder.findOne({studentID:studentID,courseID:courseOfURL._id});
    var result = {
        courseOfURL,
        folder
    }

    return result;
    
}
