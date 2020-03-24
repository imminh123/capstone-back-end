const Note = require('../models/Note');
const Student = require('../models/Student');
const Course = require('../models/Course');
const getFunction = require('./getFunction');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//create a note
exports.createNote = async function(studentID,course,scannedContent,description,url,index){
    //check studentid
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    //check course
    try{
        course=Objectid(course);
    }catch{
        return makeJson('error','courseID not correct');
    }

    var courseEn = await Course.findOne({_id:course});
    if (courseEn==null||courseEn=='') return makeJson('error','Course not found');

    var note = new Note({
        studentID:studentID,
        course:course,
        scannedContent:scannedContent,
        description:description,
        url:url,
        index:index,
        dateModified: getFunction.today()
    });

    await note.save();
    return makeJson('success','Create successfully');
}

//changenote
exports.updateNote = async function(noteID,course,scannedContent,description,url,index,isPinned){
    //check noteID
    try{
        noteID=Objectid(noteID);
    }catch{
        return makeJson('error','noteID not correct');
    }
    var note=await Note.findById(noteID);
    if (note==null||note=='') return makeJson('error','noteID not found');
    
    //check course
    try {
        course=Objectid(course);
    }catch{
        return makeJson('error','courseID not correct');
    }
    var courseEN = await Course.findById(course);
    if (courseEN==null||courseEN=='') return makeJson('error','Course not found');

    await Note.updateOne({_id:noteID},{course:course,scannedContent:scannedContent,description:description,url:url,index:index,isPinned:isPinned,dateModified:getFunction.today()});
    note=await Note.findById(noteID);
    var result = {
        success:'Update successfully',
        note:{
            isPinned:note.isPinned,
            _id:note._id,
            studentID:note.studentID,
            course:note.course,
            scannedContent:note.scannedContent,
            description:note.description,
            url:note.url,
            index:note.index,
            dateModified:note.dateModified,
        }
    }
    return result;
}

//change active of teacher
exports.changeIsPinned = async function(id,isPinned){
    //check teacherID
    try{
        id=Objectid(id);
    }
    catch{
        return makeJson('error','NoteID not correct');
    }
        var note=await Note.find({_id:id});
        if (note==null||note=='') return makeJson('error','NoteID not found');
        await Note.updateOne({_id:id},{isPinned:isPinned});
        return makeJson('success','Update successfully');
}

//deletenote
exports.deleteNote = async function(noteID){
    //check noteID
    try{
        noteID=Objectid(noteID);
    }catch{
        return makeJson('error','noteID not correct');
    }
    var note=await Note.findById(noteID);
    if (note==null||note=='') return makeJson('error','noteID not found');
    await Note.deleteOne({_id:noteID});
    return makeJson('success','Delete successfully');
}

//getnote
exports.getNote = async function(noteID){
    //check noteID
    try{
        noteID=Objectid(noteID);
    }catch{
        return makeJson('error','noteID not correct');
    }
    var note=await Note.findById(noteID);
    if (note==null||note=='') return makeJson('error','noteID not found');
    return note;
    
}

//allnote
exports.getAllNoteByStudentID = async function(studentID){
    //check studentID
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    return await Note.find({studentID:studentID});
   
}

exports.searchNote = async function(sID,detail){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    var result = await Note.find({
            studentID:sID,
            $or:[{scannedContent:{$regex:detail,$options:"i"}},
                  {description:{$regex:detail,$options:"i"}}
                ]
        });
    return result;
}

exports.getRecentNote = async function(sID,limit){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(sID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    var notes = await Note.find({studentID:sID});
    notes.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });
    return notes.slice(0,limit);
}