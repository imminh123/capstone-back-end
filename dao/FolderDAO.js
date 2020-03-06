const Folder = require('../models/Folder');
const Note = require('../models/Note');
const Student = require('../models/Student');
const getTime = require('../dao/getTime');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.getFolderByStudentID = async function(id) {
    try{
        id=Objectid(id);
        var student=await Student.findById(id);
        if (student==null||student=='') return makeJson('Error','StudentID not found');
        var folders=Folder.find({studentID:id}).populate('notes');
        return folders;
    }catch{
        return makeJson('Error','ID not correct');
    }
}

exports.createFolder = async function(folderName,studentID) {
    try{
        studentID=Objectid(studentID);
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('Error','StudentID not found');
        var folder = new Folder({
            studentID:studentID,
            folderName:folderName,
            notes:[],
            dateCreated: getTime.today()
        });

        await folder.save();
        return makeJson('Sucess','Create successfully');
    }catch{
        return makeJson('Error','ID not correct');
    }
}

exports.changeFolderName = async function(id,folderName){
    try{
        id=Objectid(id);
        var folder=await Folder.find({_id:id});
        if (folder==null||folder=='') return makeJson('ID not found');
        await Folder.updateOne({_id:id},{folderName:folderName});
        return makeJson('Update successfully');
    }catch{
        return makeJson('ID not correct');
    }
}

async function deleteNoteFromFolder(id){
    id=Objectid(id);
}

//not complete yet
exports.deleteFolder = async function(id){
    try{
        id=Objectid(id);
        var folder=await Folder.findById(id);
        if (folder==null||folder=='') return makeJson('Error','ID not found');
        await deleteNoteFromFolder(id);
        await Folder.deleteOne({_id:id},function(err){
            if (err) {
                return makeJson('Error','Error when delete');
            }
        });
        folder.notes.forEach(async function (data) {
            var noteid = Objectid(data);
            await Note.deleteOne({_id:noteid});
            });
        return makeJson('Success','Delete successfully');
    }catch{
        return makeJson('Error','ID not correct');
    }
}

exports.getAllFolder = async function(id) {
    try{
        id=Objectid(id);
        var folders=await Folder.find({studentID:id}).populate('notes');
        return folders;
    }catch{
        return makeJson('Error','Student ID not correct');
    }
}
