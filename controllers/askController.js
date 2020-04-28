const AskDAO = require('../dao/AskDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.closeAsk=async(req,res)=>{
    var askID=req.params['id'];
    var rating=req.params['rating'];
    res.send(await AskDAO.closeAsk(askID,rating));
}

exports.createAsk = async (req,res) => {
    var scannedContent=req.body.scannedContent;
    var askContent=req.body.askContent;
    var student=req.body.student;
    var teacher=req.body.teacher;
    var courseID=req.body.courseID;
    var url=req.body.url;
    //check if all fields are filled
    if (isEmpty(scannedContent)||isEmpty(askContent)||isEmpty(student)||isEmpty(teacher))
                res.send(msgEmpty()); 
        else {
            res.send(await AskDAO.createAsk(scannedContent,askContent,student,teacher,courseID,url));                    
        }
}

//tra ve da co faq chua
exports.getAskByID = async (req,res) => {
    var userID=req.params['userID'];
    var askID=req.params['askID'];
    res.send(await AskDAO.getAskByID(userID,askID));
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
    if (isEmpty(message)) res.send(msgEmpty());
    res.send(await AskDAO.addComment(askID,userID,message));
}

exports.deleteAskByID = async (req,res) => {
    var askID=req.params['id'];
    res.send(await AskDAO.deleteAsk(askID));
}

exports.searchAsk = async (req,res) => {
    var userID=req.query.userID;
    var text=req.query.text;
    res.send(await AskDAO.searchAsk(userID,text));
}

exports.openAsk=async(req,res)=>{
    var askID=req.params['id'];
    res.send(await AskDAO.openAsk(askID));
}