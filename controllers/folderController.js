const folderDAO = require('../dao/FolderDAO');

exports.getAllFolder=async (req,res)=>{
    res.send(await folderDAO.getAllFolder());
}

exports.getFolderByStudentID = async (req,res) => {
    var id=req.params['id'];
    res.send(await folderDAO.getFolderByStudentID(id));
}

exports.getHighlightByFolderID = async (req,res) => {
    var folderID=req.params['folderID'];
    res.send(await folderDAO.getHighlightByFolderID(folderID));
}

exports.deleteHighlightByFolderID = async (req,res) => {
    var folderID=req.params['folderID'];
    res.send(await folderDAO.deleteHighlightByFolderID(folderID));
}

exports.getNoteByFolderID = async (req,res) => {
    var folderID=req.params['folderID'];
    res.send(await folderDAO.getNoteByFolderID(folderID));
}

exports.deleteNoteByFolderID = async (req,res) => {
    var folderID=req.params['folderID'];
    res.send(await folderDAO.deleteNoteByFolderID(folderID));
}

exports.createFolder = async(req,res)=>{
    var studentID=req.body.studentID;
    var courseCode=req.body.courseCode;
    var courseName=req.body.courseName;
    res.send(await folderDAO.createFolder(studentID,courseCode,courseName));
}

exports.deleteFolder=async(req,res)=>{
    var id=req.params['id'];
    res.send(await folderDAO.deleteFolder(id));
}