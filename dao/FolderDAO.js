const mongoose = require('mongoose');
const Folder = require('../models/Folder');
const Note = require('../models/Note');
const Student = require('../models/Student');
var Objectid = require('mongodb').ObjectID;

function makeJson(msg){
    var newObject = '{"message":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.getFolderByStudentID = async function(id) {
    try{
        id=Objectid(id);
        var student=await Student.findById(id);
        if (student==null||student=='') return makeJson('StudentID not found');
        var folders=Folder.find({studentID:id}).populate('notes');
        return folders;
    }catch{
        return makeJson('ID not correct');
    }
}

exports.createFolder = async function(folderName,studentID) {
    try{
        studentID=Objectid(studentID);
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('StudentID not found');

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        var folder = new Folder({
            studentID:studentID,
            folderName:folderName,
            notes:[],
            dateCreated: today
        });

        await folder.save();
        return makeJson('Create successfully');
    }catch{
        return makeJson('ID not correct');
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
        if (folder==null||folder=='') return makeJson('ID not found');
        await deleteNoteFromFolder(id);
        await Folder.deleteOne({_id:id},function(err){
            if (err) {
                return makeJson('Error');
            }
        });
        return makeJson('Delete successfully');
    }catch{
        return makeJson('ID not correct');
    }
}