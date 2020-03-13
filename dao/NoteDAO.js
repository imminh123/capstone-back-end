const Note = require('../models/Note');
const Student = require('../models/Student');
const Course = require('../models/Course');
const getTime = require('../dao/getTime');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//create a note
exports.createNote = async function(studentID,courseCode,note,description,url,index){
    //check studentid
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    //check course
    var course = await Course.findOne({courseCode:courseCode});
    if (course==null||course=='') return makeJson('error','courseCode not found');

    var note = new Note({
        studentID:studentID,
        courseCode:courseCode,
        note:note,
        description:description,
        url:url,
        index:index,
        dateModified: getTime.today()
    });

    await note.save();
    return makeJson('success','Create successfully');
}

//changenote
exports.updateNote = async function(noteID,courseCode,note,description,url,index,isPinned){
    //check noteID
    try{
        noteID=Objectid(noteID);
    }catch{
        return makeJson('error','noteID not correct');
    }
        var noteentity=await Note.findById(noteID);
        if (noteentity==null||noteentity=='') return makeJson('error','noteID not found');
    
    //check course
    var course = await Course.findOne({courseCode:courseCode});
    if (course==null||course=='') return makeJson('error','courseCode not found');
    await Note.updateOne({_id:noteID},{courseCode:courseCode,note:note,description:description,url:url,index:index,isPinned:isPinned,dateModified:getTime.today()});
    noteentity=await Note.findById(noteID);
    var result = {
        success:'Update successfully',
        note:{
            isPinned:noteentity.isPinned,
            _id:noteentity._id,
            studentID:noteentity.studentID,
            courseCode:noteentity.courseCode,
            note:noteentity.note,
            description:noteentity.description,
            url:noteentity.url,
            index:noteentity.index,
            dateModified:noteentity.dateModified,
        }
    }
    return (result);
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
    
    await Note.deleteOne({_id:noteID},function(err){
        if (err) {
            return makeJson('error','Error when delete');
        }
    });
    await Folder.updateOne(
        {},
        {$pull: {notes:noteID}});
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
        var notes=await Note.find({studentID:studentID});
        return notes;
   
}

exports.searchNote = async function(text,sID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
        var result = await Note.find({note:{$regex:text,$options:"i"},studentID:sID}, 
                    function(err, docs) {
                        if (err) handleError(err);
                });
        return result;
    
}

exports.getNoteByCourse = async function(courseCode,sID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('error','studentID not correct');
    }
        var course = await Course.findOne({courseCode:courseCode});
        if (course==null||course=='') return makeJson('error','courseCode not found');
        var result = await Note.find({studentID:sID,courseCode:courseCode});
        return result;
}