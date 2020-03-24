const Student = require('../models/Student');
const Folder = require('../models/Folder');
const Course = require('../models/Course');
const Note = require('../models/Note');
const Highlight = require('../models/Highlight');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.getAllFolder = async function(){
    return await Folder.find();
}

exports.getFolderNote = async function(sID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var folders=[];

    var courses=(await Student.findById(sID).populate('course')).courses;
    var folders = await Folder.find({courseID:{$in:courses}});
    var notes=await Note.find({studentID:sID});
    var existed;
    for (note of notes) {
        existed=0;
        for (folder of folders){
            if (folder._id==note.folderID.toString()){ 
                existed=1;
                break;
            }
        }
        if (!existed)
            folders.push(await Folder.findOne({_id:note.folderID}));
    }

    return folders;
}

exports.getFolderHighlight = async function(sID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var folders=[];

    var courses=(await Student.findById(sID).populate('course')).courses;
    var folders = await Folder.find({courseID:{$in:courses}});
    var highlights=await Highlight.find({studentID:sID});
    var existed;
    for (highlight of highlights) {
        existed=0;
        for (folder of folders){
            if (folder._id==highlight.folderID.toString()){ 
                existed=1;
                break;
            }
        }
        if (!existed)
            folders.push(await Folder.findOne({_id:highlight.folderID}));
    }

    return folders;
}

exports.getHighlightByFolderID = async function(sID,fID){

    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    try {
        fID=Objectid(fID);
    }catch{
        return makeJson('error','ID not correct');
    }
    var folder = await Folder.findById(fID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    return await Highlight.find({studentID:sID,folderID:fID});
}

exports.deleteHighlightByFolderID= async function(sID,fID){
    
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    try {
        fID=Objectid(fID);
    }catch{
        return makeJson('error','ID not correct');
    }
    var folder = await Folder.findById(fID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    await Highlight.deleteMany({studentID:sID,folderID:fID});
    return makeJson('success','Delete successfully');
}


exports.getNoteByFolderID = async function(sID,fID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    try {
        fID=Objectid(fID);
    }catch{
        return makeJson('error','ID not correct');
    }
    var folder = await Folder.findById(fID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    return await Note.find({studentID:sID,folderID:fID});
}

exports.deleteNoteByFolderID= async function(sID,fID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    try {
        fID=Objectid(fID);
    }catch{
        return makeJson('error','ID not correct');
    }
    var folder = await Folder.findById(fID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    await Note.deleteMany({studentID:sID,folderID:fID});
    return makeJson('success','Delete successfully');
}