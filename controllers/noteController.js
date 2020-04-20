const NoteDAO = require('../dao/NoteDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createNote = async (req,res) => {
    var studentID=req.body.studentID;
    var folderID=req.body.folderID;
    var scannedContent=req.body.scannedContent;
    var description=req.body.description;
    var url=req.body.url;
    //check if all fields are filled
    if (isEmpty(studentID)||isEmpty(scannedContent)||isEmpty(description)||isEmpty(url))
                res.send(msgEmpty()); 
        else {
            res.send(await NoteDAO.createNote(studentID,folderID,scannedContent,description,url));                    
        }
}

exports.updateNoteByID = async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var noteID=req.params['id'];
    var folderID=req.body.folderID;
    var scannedContent=req.body.scannedContent;
    var description=req.body.description;
    var url=req.body.url;
    var isPinned=req.body.isPinned;
    // console.log(noteID+' '+folderID+' '+scannedContent+' '+description+' '+url+' '+isPinned);
    //check if all fields are filled
    if (isEmpty(folderID)||isEmpty(scannedContent)||isEmpty(description)||isEmpty(url)||isPinned==undefined||isPinned.toString()=='')
                res.send(msgEmpty()); 
        else {
            res.send(await NoteDAO.updateNote(noteID,folderID,scannedContent,description,url,isPinned));                    
        }
}

exports.changeNoteIsPinned = async (req,res) => {
    var noteID=req.params['id'];
    var isPinned=req.body.isPinned;
    if (isPinned==undefined||isPinned.toString()=='') res.send(msgEmpty());
        else res.send(await NoteDAO.changeIsPinned(noteID,isPinned));
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