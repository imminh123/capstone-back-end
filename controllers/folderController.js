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
    var sID=req.params['studentID'];
    var fID=req.params['folderID'];
    res.send(await folderDAO.getHighlightByFolderID(sID,fID));
}

exports.deleteHighlightByFolderID = async (req,res) => {
    var sID=req.params['studentID'];
    var fID=req.params['folderID'];
    res.send(await folderDAO.deleteHighlightByFolderID(sID,fID));
}

exports.getNoteByFolderID = async (req,res) => {
    var sID=req.params['studentID'];
    var fID=req.params['folderID'];
    res.send(await folderDAO.getNoteByFolderID(sID,fID));
}

exports.deleteNoteByFolderID = async (req,res) => {
    var sID=req.params['studentID'];
    var fID=req.params['folderID'];
    res.send(await folderDAO.deleteNoteByFolderID(sID,fID));
}