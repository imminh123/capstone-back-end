var Objectid = require('mongodb').ObjectID;
const Note = require('../models/Note');
const Folder = require('../models/Folder');
const Student = require('../models/Student');
const getFunction = require('./getFunction');

function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);

}

//create a note
exports.createNote = async function(studentID,folderID,scannedContent,description,url,index){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    folderID=Objectid(folderID);
    var folder = await Folder.findOne({_id:folderID});
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    if (studentID!=folder.studentID) return makeJson('error','input studentID and folder.studentID not match');

    var note = new Note({
        studentID:studentID,
        folderID:folderID,
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
exports.updateNote = async function(noteID,folderID,scannedContent,description,url,index,isPinned){
    
    noteID=Objectid(noteID);
    var note=await Note.findById(noteID);
    if (note==null||note=='') return makeJson('error','noteID not found');
    
    folderID=Objectid(folderID);
    var folder = await Folder.findOne({_id:folderID});
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    await Note.updateOne({_id:noteID},{folderID:folderID,scannedContent:scannedContent,description:description,url:url,index:index,isPinned:isPinned,dateModified:getFunction.today()});
    
    note=await Note.findById(noteID);
    var result = {
        success:'Update successfully',
        note:{
            isPinned:note.isPinned,
            _id:note._id,
            studentID:note.studentID,
            folderID:note.folderID,
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

    id=Objectid(id);
    var note=await Note.find({_id:id});
    if (note==null||note=='') return makeJson('error','NoteID not found');

    await Note.updateOne({_id:id},{isPinned:isPinned});

    return makeJson('success','Update successfully');

}

//deletenote
exports.deleteNote = async function(noteID){

    noteID=Objectid(noteID);
    var note=await Note.findById(noteID);
    if (note==null||note=='') return makeJson('error','noteID not found');

    await Note.deleteOne({_id:noteID});

    return makeJson('success','Delete successfully');

}

//getnote
exports.getNote = async function(noteID){

    noteID=Objectid(noteID);
    var note=await Note.findById(noteID);
    if (note==null||note=='') return makeJson('error','noteID not found');

    return note;
    
}

//allnote
exports.getAllNoteByStudentID = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    return await Note.find({studentID:studentID});
   
}

exports.searchNote = async function(studentID,folderID,text){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    if (folderID.toString()=='all') {

        var result = await Note.find({
            studentID:studentID,
            $or:[{scannedContent:{$regex:text,$options:"i"}},
                  {description:{$regex:text,$options:"i"}}
                ]
        });

    } else {

        var result = await Note.find({
            studentID:studentID,folderID:Objectid(folderID),
            $or:[{scannedContent:{$regex:text,$options:"i"}},
                  {description:{$regex:text,$options:"i"}}
                ]
        });

    }

    return result;

}

exports.getRecentNote = async function(studentID,limit){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var notes = await Note.find({studentID:studentID});

    notes.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });
    
    return notes.slice(0,limit);
}