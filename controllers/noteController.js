const NoteDAO = require('../dao/NoteDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"Error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createNote = async (req,res) => {
    var studentID=req.body.studentID;
    var folderID=req.body.folderID;
    var note=req.body.note;
    var description=req.body.description;
    var url=req.body.url;
    var index=req.body.index;
    //check if all fields are filled
    if (isEmpty(studentID)||isEmpty(folderID)||isEmpty(note)||isEmpty(description)||isEmpty(url)||isEmpty(index))
                res.send(msgEmpty()); 
        else {
            res.send(await NoteDAO.createNote(studentID,folderID,note,description,url,index));                    
        }
}

exports.updateNoteByID = async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var noteID=req.params['id'];
    var folderID=req.body.folderID;
    var note=req.body.note;
    var description=req.body.description;
    var url=req.body.url;
    var index=req.body.index;
    var isPinned=req.body.isPinned;
    //check if all fields are filled
    if (isEmpty(folderID)||isEmpty(note)||isEmpty(description)||isEmpty(url)||isEmpty(index)||isPinned==undefined||isPinned.toString()=='')
                res.send(msgEmpty()); 
        else {
            res.send(await NoteDAO.updateNote(noteID,folderID,note,description,url,index,isPinned));                    
        }
}

exports.changeNoteIsPinned = async (req,res) => {
    var noteID=req.params['id'];
    var isPinned=req.body.isPinned;
    if (isPinned==undefined||isPinned.toString()=='') res.send(msgEmpty());
        else res.send(await NoteDAO.changeNoteIsPinned(noteID,isPinned));
}

exports.deleteNoteByID = async (req,res) => {
    var noteID=req.params['id'];
    res.send(await NoteDAO.deleteNote(noteID));
}

exports.getNoteByID = async (req,res) => {
    var noteID=req.params['id'];
    // console.log(await NoteDAO.getNote(noteID));
    res.send(await NoteDAO.getNote(noteID));
}

exports.allNoteOfStudent = async (req,res) => {
    var studentID=req.params['id'];
    res.send(await NoteDAO.getAllNoteByStudentID(studentID));
}

exports.allNoteOfFolder = async (req,res) => {
    var folderID=req.params['id'];
    res.send(await NoteDAO.getAllNoteByFolderID(folderID));
}