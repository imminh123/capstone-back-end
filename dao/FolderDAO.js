var Objectid = require('mongodb').ObjectID;
const Note = require('../models/Note');
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

    return await Folder.find({studentID:studentID});

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
    await Folder.deleteOne({_id:folderID});

    return makeJson('success','Delete successfully');
    
}