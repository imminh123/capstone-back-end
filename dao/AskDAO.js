const Ask = require('../models/Ask');
const Comment = require('../models/Comment');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const getTime = require('../dao/getTime');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//create new ask
exports.createAsk = async function(scannedContent,askContent,student,teacher,courseURL){
    try{
        student=Objectid(student);
    }catch{
        return makeJson('Error','studentID not correct');
    }
        var studententity=await Student.findById(student);
        if (studententity==null||studententity=='') return makeJson('Error','studentID not found');
    

    try{
        teacher=Objectid(teacher);
    }catch{
        return makeJson('Error','teacherID not correct');
    }
        var teacherentity=await Student.findById(student);
        if (teacherentity==null||teacherentity=='') return makeJson('Error','teacherID not found');
   
    
    var ask = new Ask({
        scannedContent:scannedContent,
        askContent:askContent,
        student:student,
        teacher:teacher,
        courseURL:courseURL,
        comments:[],
        dateModified: getTime.today(),
        dateCreated: getTime.today()
    });

    console.log(ask);

    await ask.save();
    return makeJson('Sucess','Create successfully');
}

//delete a comment
async function deleteComments(comments){
    comments.forEach(async function(data){
        data=Objectid(data);
        await Comment.deleteOne({_id:data});       
    });
}

//delete ask and all its comments
exports.deleteAsk = async function(id){
    //check if ask is valid
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','askID not correct');
    }
        var ask=await Ask.findById(id);
        if (ask==null||ask=='') return makeJson('Error','askID not found');
    
    //delete all comments
    await deleteComments(ask.comments);
    //delete ask
    await Ask.deleteOne({_id:id},function(err){
        if (err) {
            return makeJson('Error','Error when delete');
        }
    });
    return makeJson('Sucess','Delete successfully');
}

//get an ask by id
exports.getAskByID = async function(askID){
    //check valid ask
    try{
        askID=Objectid(askID);
    }catch{
        return makeJson('Error','askID not correct');
    }
        var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
        if (ask==null||ask=='') return makeJson('Error','askID not found');
        return ask;
   
}

//return all ask of a student by id
exports.allAskOfStudent = async function(studentID){
    //check studentid
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('Error','studentID not correct');
    }
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('Error','studentID not found');
        var asks=await Ask.find({student:studentID}).populate('student').populate('comments');
        return asks;
    
}

//return all ask of a teacher by id
exports.allAskOfTeacher = async function(teacherID){
    //check teacherID
    try{
        teacherID=Objectid(teacherID);
    }catch{
        return makeJson('Error','teacherID not correct');
    }
        var teacher=await Teacher.findById(teacherID);
        if (teacher==null||teacher=='') return makeJson('Error','teacherID not found');
        var asks=await Ask.find({teacher:teacherID}).populate('student').populate('teacher');
        return asks;
    
}

//return all ask
exports.allAsk = async function(){
    var asks=await Ask.find().populate('student').populate('teacher').populate('comments');
    return asks;
}

//add a new comment to ask
exports.addComment = async function(askID,userID,message){
    //check askID
    try{
        askID=Objectid(askID);
    }catch{
        return makeJson('Error','askID not correct');
    }
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return makeJson('Error','askID not found');
    //check input userID 
    if (userID!=ask.student._id && userID!=ask.teacher._id) return makeJson('Error','UserID isnt match');
    //create new comment
    var comment = new Comment({
        userID: userID,
        ask: askID,
        message: message,
        dateCreated: getTime.today()
    });
    await comment.save();
    //push comment to ask
    await Ask.updateOne({ _id: askID }, 
        { $addToSet: { comments: comment._id } , dateModified: getTime.today()}, { safe: true, upsert: true }, function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            //do stuff
        }
    });
    return makeJson('Sucess','Add comment successfully');
}