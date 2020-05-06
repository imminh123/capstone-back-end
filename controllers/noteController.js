const NoteDAO = require('../dao/NoteDAO');

exports.createNote = async (req,res) => {
    var studentID=req.body.studentID;
    var folderID=req.body.folderID;
    var scannedContent=req.body.scannedContent;
    var description=req.body.description;
    var url=req.body.url;
    res.send(await NoteDAO.createNote(studentID,folderID,scannedContent,description,url));                    
}

exports.updateNoteByID = async (req,res) => {
    var noteID=req.params['id'];
    var scannedContent=req.body.scannedContent;
    var description=req.body.description;
    var url=req.body.url;
    var isPinned=req.body.isPinned;
    res.send(await NoteDAO.updateNote(noteID,scannedContent,description,url,isPinned));                    
}

exports.changeNoteIsPinned = async (req,res) => {
    var noteID=req.params['id'];
    var isPinned=req.body.isPinned;
    res.send(await NoteDAO.changeIsPinned(noteID,isPinned));
}

exports.deleteNoteByID = async (req,res) => {
    var noteID=req.params['id'];
    res.send(await NoteDAO.deleteNote(noteID));
}

exports.getNoteByID = async (req,res) => {
    var noteID=req.params['id'];
    res.send(await NoteDAO.getNote(noteID));
}

exports.allNoteOfStudent = async (req,res) => {
    var studentID=req.params['id'];
    res.send(await NoteDAO.getAllNoteByStudentID(studentID));
}

exports.searchNote = async (req,res) => {
    var studentID=req.query.studentID;
    var folderID=req.query.folderID;
    var text=req.query.text;
    res.send(await NoteDAO.searchNote(studentID,folderID,text));
}

exports.getRecentNote = async (req,res) => {
    var studentID=req.params['studentID'];
    var limit=req.params['limit'];
    res.send(await NoteDAO.getRecentNote(studentID,limit));
}