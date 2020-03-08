const Folder = require('../models/Folder');
const Note = require('../models/Note');
const Student = require('../models/Student');
const getTime = require('../dao/getTime');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//create a note
exports.createNote = async function(studentID,folderID,note,description,url,index){
    //check studentid
    try{
        studentID=Objectid(studentID);
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('Error','studentID not found');
    }catch{
        return makeJson('Error','studentID not correct');
    }
    //check folderID
    try{
        folderID=Objectid(folderID);
        var folder=await Folder.findById(folderID);
        if (folder==null||folder=='') return makeJson('Error','folderID not found');
    }catch{
        return makeJson('Error','folderID not correct');
    }
    
    var note = new Note({
        studentID:studentID,
        folderID:folderID,
        note:note,
        description:description,
        url:url,
        index:index,
        dateModified: getTime.today()
    });

    await note.save();
    await Folder.updateOne({ _id: folderID }, 
        { $addToSet: { notes: note._id } }, { safe: true, upsert: true }, function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            //do stuff
        }
    });
    return makeJson('Sucess','Create successfully');
}

//changenote
exports.updateNote = async function(noteID,folderID,note,description,url,index,isPinned){
    var folder;
    //check noteID
    try{
        noteID=Objectid(noteID);
        var noteentity=await Note.findById(noteID);
        if (noteentity==null||noteentity=='') return makeJson('Error','noteID not found');
    }catch{
        return makeJson('Error','noteID not correct');
    }
    //check folderID
    try{
        folderID=Objectid(folderID);
        folder=await Folder.findById(folderID);
        if (folder==null||folder=='') return makeJson('Error','folderID not found');
    }catch{
        return makeJson('Error','folderID not correct');
    }
    await Folder.updateOne(
        {},
        {$pull: {notes:noteID}});
    await Folder.updateOne({_id:folderID},{$addToSet:{notes:noteID}});
    await Note.updateOne({_id:noteID},{folderID:folderID,note:note,description:description,url:url,index:index,isPinned:isPinned,dateModified:getTime.today()});
    noteentity=await Note.findById(noteID);
    var result = '{'
        +'"Sucess":"Update sucessfully",'
        +'"note":{'
        +'"isPinned": '+noteentity.isPinned+','
        +'"_id": "'+noteentity._id+'",'
        +'"studentID": "'+noteentity.studentID+'",'
        +'"folderID": "'+noteentity.folderID+'",'
        +'"note": "'+noteentity.note+'",'
        +'"description": "'+noteentity.description+'",'
        +'"url": "'+noteentity.url+'",'
        +'"index": '+noteentity.index+','
        +'"dateModified": "'+noteentity.dateModified+'"'
    +'}}';
    console.log(result);
    return JSON.parse(result);
    // return makeJson('Success','Update successfully');
}

//deletenote
exports.deleteNote = async function(noteID){
    //check noteID
    try{
        noteID=Objectid(noteID);
        var note=await Note.findById(noteID);
        if (note==null||note=='') return makeJson('Error','noteID not found');
    }catch{
        return makeJson('Error','noteID not correct');
    }
    await Note.deleteOne({_id:noteID},function(err){
        if (err) {
            return makeJson('Error','Error when delete');
        }
    });
    await Folder.updateOne(
        {},
        {$pull: {notes:noteID}});
    return makeJson('Sucess','Delete successfully');
}

//getnote
exports.getNote = async function(noteID){
    //check noteID
    try{
        noteID=Objectid(noteID);
        var note=await Note.findById(noteID);
        if (note==null||note=='') return makeJson('Error','noteID not found');
        return note;
    }catch{
        return makeJson('Error','noteID not correct');
    }
}

//allnote
exports.getAllNoteByStudentID = async function(studentID){
    //check studentID
    try{
        studentID=Objectid(studentID);
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('Error','studentID not found');
        var notes=await Note.find({studentID:studentID});
        return notes;
    }catch{
        return makeJson('Error','studentID not correct');
    }
}
exports.getAllNoteByFolderID = async function(folderID){
    //check folderID
    try{
        folderID=Objectid(folderID);
        var folder=await Folder.findById(folderID);
        if (folder==null||folder=='') return makeJson('Error','folderID not found');
        var notes=await Note.find({folderID:folderID});
        return notes;
    }catch{
        return makeJson('Error','folderID not correct');
    }
}