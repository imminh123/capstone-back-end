const Folder = require('../models/Folder');
const Note = require('../models/Note');
const Student = require('../models/Student');
const getTime = require('../dao/getTime');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//check if folderName is duplicate
async function folderNameExisted(id,name){
    var folders=await Folder.find({studentID:id});
    for (const folder of folders){
        console.log(folder);
        if (folder.folderName.toString()==name.toString()){
                    return 1;
                }
    }
    return 0;
}

//all folder of a student by id
exports.getFolderByStudentID = async function(id) {
    try{
        id=Objectid(id);
        var student=await Student.findById(id);
        if (student==null||student=='') return makeJson('Error','StudentID not found');
        var folders=await Folder.find({studentID:id}).populate('notes');
        return folders;
    }catch{
        return makeJson('Error','ID not correct');
    }
}

//create new folder
exports.createFolder = async function(folderName,studentID) {
    //check studentID
    try{
        studentID=Objectid(studentID);
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('Error','StudentID not found');
        if (await folderNameExisted(studentID,folderName)) return makeJson('Error','FolderName existed');
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

//change folder name
exports.changeFolderName = async function(id,folderName){
    //check folderid
    try{
        id=Objectid(id);
        var folder=await Folder.find({_id:id});
        if (folder==null||folder=='') return makeJson('ID not found');
        if (await folderNameExisted(studentID,folderName)) return makeJson('Error','FolderName existed');
        await Folder.updateOne({_id:id},{folderName:folderName});
        return makeJson('Update successfully');
    }catch{
        return makeJson('ID not correct');
    }
}

//delete a folder and all its note
exports.deleteFolder = async function(id){
    //check folderid
    try{
        id=Objectid(id);
        var folder=await Folder.findById(id);
        if (folder==null||folder=='') return makeJson('Error','ID not found');
        //delete all notes of this folder
        folder.notes.forEach(async function (data) {
            var noteid = Objectid(data);
            await Note.deleteOne({_id:noteid});
            });
        await Folder.deleteOne({_id:id},function(err){
            if (err) {
                return makeJson('Error','Error when delete');
            }
        });
        
        return makeJson('Success','Delete successfully');
    }catch{
        return makeJson('Error','ID not correct');
    }
}

// exports.getAllFolder = async function(id) {
//     try{
//         id=Objectid(id);
//         var folders=await Folder.find({studentID:id}).populate('notes');
//         return folders;
//     }catch{
//         return makeJson('Error','Student ID not correct');
//     }
// }
