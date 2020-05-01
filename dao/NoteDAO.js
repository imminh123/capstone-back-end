var Objectid = require('mongodb').ObjectID;
const Note = require('../models/Note');
const Folder = require('../models/Folder');
const Student = require('../models/Student');
const getFunction = require('./getFunction');

//create a note
exports.createNote = async function(studentID,folderID,scannedContent,description,url){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return getFunction.makeJson('error','Student not found');

    //if has folder then check. if not then create new or get default folder
    if (folderID!=''){
        folderID=Objectid(folderID);
        var folder = await Folder.findOne({_id:folderID});
        if (folder==null||folder=='') return getFunction.makeJson('error','Folder not found');
    }
    else {
        var folder=await Folder.findOne({studentID:studentID,courseName:'Other',courseCode:'Other'});
        if (folder==null||folder=='') {
            folder=new Folder({
                studentID:studentID,
                courseID:'',
                courseCode:'Other',
                courseName:'Other'
            });
            await folder.save();
        }
        folderID=folder._id;
    }

    var note = new Note({
        studentID:studentID,
        folderID:folderID,
        scannedContent:scannedContent,
        description:description,
        url:url,
        dateModified: getFunction.today()
    });
    await note.save();

    return getFunction.makeJson('success','Create successfully');

}

//changenote
exports.updateNote = async function(noteID,scannedContent,description,url,isPinned){

    noteID=Objectid(noteID);
    var note=await Note.findById(noteID);
    if (note==null||note=='') return getFunction.makeJson('error','Note not found');

    var err='';
    note=await Note.findOneAndUpdate({_id:noteID},{scannedContent:scannedContent,description:description,url:url,isPinned:isPinned,dateModified:getFunction.today()}
        ,{returnOriginal: false}, function(error){
            if (error) {
                // console.log(error);
                err=error;
            }
        });
    
    if (err!='') return getFunction.makeJson('error',err);

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
            dateModified:note.dateModified,
        }
    }

    return result;

}

//change active of teacher
exports.changeIsPinned = async function(id,isPinned){

    id=Objectid(id);
    var note=await Note.find({_id:id});
    if (note==null||note=='') return getFunction.makeJson('error','Note not found');

    await Note.updateOne({_id:id},{isPinned:isPinned});

    return getFunction.makeJson('success','Update successfully');

}

//deletenote
exports.deleteNote = async function(noteID){

    noteID=Objectid(noteID);
    var note=await Note.findById(noteID);
    if (note==null||note=='') return getFunction.makeJson('error','Note not found');

    await Note.deleteOne({_id:noteID});

    return getFunction.makeJson('success','Delete successfully');

}

//getnote
exports.getNote = async function(noteID){

    noteID=Objectid(noteID);
    var note=await Note.findById(noteID);
    if (note==null||note=='') return getFunction.makeJson('error','Note not found');

    return note;
    
}

//allnote
exports.getAllNoteByStudentID = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return getFunction.makeJson('error','Student not found');

    return await Note.find({studentID:studentID});
   
}

exports.searchNote = async function(studentID,folderID,text){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return getFunction.makeJson('error','Student not found');

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
    if (student==null||student=='') return getFunction.makeJson('error','Student not found');

    var notes = await Note.find({studentID:studentID});

    notes.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });
    
    return notes.slice(0,limit);
}