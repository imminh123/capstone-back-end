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
    var course=req.body.course;
    var scannedContent=req.body.scannedContent;
    var description=req.body.description;
    var url=req.body.url;
    var index=req.body.index;
    //check if all fields are filled
    if (isEmpty(studentID)||isEmpty(course)||isEmpty(scannedContent)||isEmpty(description)||isEmpty(url)||isEmpty(index))
                res.send(msgEmpty()); 
        else {
            res.send(await NoteDAO.createNote(studentID,course,scannedContent,description,url,index));                    
        }
}

exports.updateNoteByID = async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var noteID=req.params['id'];
    var course=req.body.course;
    var scannedContent=req.body.scannedContent;
    var description=req.body.description;
    var url=req.body.url;
    var index=req.body.index;
    var isPinned=req.body.isPinned;
    //check if all fields are filled
    if (isEmpty(course)||isEmpty(scannedContent)||isEmpty(description)||isEmpty(url)||isEmpty(index)||isPinned==undefined||isPinned.toString()=='')
                res.send(msgEmpty()); 
        else {
            res.send(await NoteDAO.updateNote(noteID,course,scannedContent,description,url,index,isPinned));                    
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
    // console.log(await NoteDAO.getNote(noteID));
    res.send(await NoteDAO.getNote(noteID));
}

exports.allNoteOfStudent = async (req,res) => {
    var studentID=req.params['id'];
    res.send(await NoteDAO.getAllNoteByStudentID(studentID));
}

exports.searchNote = async (req,res) => {
    var sID=req.params['studentID'];
    var detail=req.params['detail'];
    res.send(await NoteDAO.searchNote(sID,detail));
}

exports.getNoteByCourse = async (req,res) => {
    var sID=req.params['studentID'];
    var course=req.params['courseID'];
    res.send(await NoteDAO.getNoteByCourse(course,sID));
}

exports.deleteNoteByCourseID = async (req,res) => {
    var sID=req.params['studentID'];
    var course=req.params['courseID'];
    res.send(await NoteDAO.deleteNoteByCourseID(sID,course));
}

exports.getRecentNote = async (req,res) => {
    var sID=req.params['studentID'];
    var limit=req.params['limit'];
    res.send(await NoteDAO.getRecentNote(sID,limit));
}