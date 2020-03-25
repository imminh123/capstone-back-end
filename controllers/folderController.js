const folderDAO = require('../dao/FolderDAO');

exports.getAllFolder=async (req,res)=>{
    res.send(await folderDAO.getAllFolder());
}

exports.getFolderNote = async (req,res) => {
    var id=req.params['id'];
    res.send(await folderDAO.getFolderNote(id));
}

exports.getFolderHighlight = async (req,res) => {
    var id=req.params['id'];
    res.send(await folderDAO.getFolderHighlight(id));
}

exports.getHighlightByFolderID = async (req,res) => {
    var studentID=req.params['studentID'];
    var folderID=req.params['folderID'];
    res.send(await folderDAO.getHighlightByFolderID(studentID,folderID));
}

exports.deleteHighlightByFolderID = async (req,res) => {
    var studentID=req.params['studentID'];
    var folderID=req.params['folderID'];
    res.send(await folderDAO.deleteHighlightByFolderID(studentID,folderID));
}

exports.getNoteByFolderID = async (req,res) => {
    var studentID=req.params['studentID'];
    var folderID=req.params['folderID'];
    res.send(await folderDAO.getNoteByFolderID(studentID,folderID));
}

exports.deleteNoteByFolderID = async (req,res) => {
    var studentID=req.params['studentID'];
    var folderID=req.params['folderID'];
    res.send(await folderDAO.deleteNoteByFolderID(studentID,folderID));
}