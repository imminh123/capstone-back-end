const mongoose = require('mongoose');
const Folder = require('../models/Folder');
const Note = require('../models/Note');
const Student = require('../models/Student');
var Objectid = require('mongodb').ObjectID;

function makeJson(msg){
    var newObject = '{"message":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.createNote = async function(studentID,folderID,note,description,url,index){
    try{
        studentID=Objectid(studentID);
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('studentID not found');
    }catch{
        return makeJson('studentID not correct');
    }

    try{
        folderID=Objectid(folderID);
        var folder=await Folder.findById(folderID);
        if (folder==null||folder=='') return makeJson('folderID not found');
    }catch{
        return makeJson('folderID not correct');
    }

    var note = new Note({
        studentID:studentID,
        folderID:folderID,
        note:note,
        description:description,
        url:url,
        index:index
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
    return makeJson('Create successfully');
}