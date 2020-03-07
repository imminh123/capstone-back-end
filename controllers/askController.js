const AskDAO = require('../dao/AskDAO');

async function isEmpty(scannedContent,askContent,student,teacher,courseURL){
    if ([scannedContent,askContent,student,teacher,courseURL].includes(undefined)
        || [scannedContent,askContent,student,teacher,courseURL].includes(null)
            || (scannedContent=="") || (askContent=="")
                || (student=="") || (teacher=="") || (courseURL=""))
                return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"Error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createAsk = async (req,res) => {
    var scannedContent=req.body.scannedContent;
    var askContent=req.body.askContent;
    var student=req.body.student;
    var teacher=req.body.teacher;
    var courseURL=req.body.courseURL;
    //check if all fields are filled
    if (await isEmpty(scannedContent,askContent,student,teacher,courseURL))
                res.send(msgEmpty()); 
        else {
            res.send(await AskDAO.createAsk(scannedContent,askContent,student,teacher,courseURL));                    
        }
}

exports.getAskByID = async (req,res) => {
    var noteID=req.params['id'];
    res.send(await AskDAO.getAskByID(noteID));
}

exports.allAskOfStudent = async (req,res) => {
    var studentID=req.params['id'];
    res.send(await AskDAO.allAskOfStudent(studentID));
}

exports.allAskOfTeacher = async (req,res) => {
    var teacherID=req.params['id'];
    res.send(await AskDAO.allAskOfTeacher(teacherID));
}

exports.allAsk = async (req,res) => {
    res.send(await AskDAO.allAsk());
}

exports.addComment = async (req,res) => {
    var askID=req.params['id'];
    var userID=req.body.userID;
    var message=req.body.message;
    res.send(await AskDAO.addComment(askID,userID,message));
}

exports.deleteAskByID = async (req,res) => {
    var askID=req.params['id'];
    res.send(await AskDAO.deleteAsk(askID));
}