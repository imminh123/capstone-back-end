const Ask = require('../models/Ask');
const Comment = require('../models/Comment');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const getFunction = require('./getFunction');
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
        return makeJson('error','studentID not correct');
    }
    var studententity=await Student.findById(student);
    if (studententity==null||studententity=='') return makeJson('error','studentID not found');
    
    try{
        teacher=Objectid(teacher);
    }catch{
        return makeJson('error','teacherID not correct');
    }
    var teacherentity=await Student.findById(student);
    if (teacherentity==null||teacherentity=='') return makeJson('error','teacherID not found');
   
    var ask = new Ask({
        scannedContent:scannedContent,
        askContent:askContent,
        student:student,
        teacher:teacher,
        courseURL:courseURL,
        comments:[],
        dateModified: getFunction.today(),
        dateCreated: getFunction.today(),
        status: "waiting"
    });

    await ask.save();
    return makeJson('success','Create successfully');
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
        return makeJson('error','askID not correct');
    }
        var ask=await Ask.findById(id);
        if (ask==null||ask=='') return makeJson('error','askID not found');
    
    //delete all comments
    await deleteComments(ask.comments);
    //delete ask
    await Ask.deleteOne({_id:id});
    return makeJson('success','Delete successfully');
}

//get an ask by id
exports.getAskByID = async function(askID){
    //check valid ask
    try{
        askID=Objectid(askID);
    }catch{
        return makeJson('error','askID not correct');
    }
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return makeJson('error','askID not found');
    return ask;
   
}

//return all ask of a student by id
exports.allAskOfStudent = async function(studentID){
    //check studentid
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    return await Ask.find({student:studentID}).populate('student').populate('teacher');
    
}

//return all ask of a teacher by id
exports.allAskOfTeacher = async function(teacherID){
    //check teacherID
    try{
        teacherID=Objectid(teacherID);
    }catch{
        return makeJson('error','teacherID not correct');
    }
    var teacher=await Teacher.findById(teacherID);
    if (teacher==null||teacher=='') return makeJson('error','teacherID not found');
    return await Ask.find({teacher:teacherID}).populate('student').populate('teacher');
    
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
        return makeJson('error','askID not correct');
    }
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return makeJson('error','askID not found');
    //check input userID 
    if (userID!=ask.student._id && userID!=ask.teacher._id) return makeJson('error','UserID isnt match');
    //create new comment
    var comment = new Comment({
        userID: userID,
        ask: askID,
        message: message,
        dateCreated: getFunction.today()
    });
    await comment.save();
    //push comment to ask
    await Ask.updateOne({ _id: askID }, 
        { $addToSet: { comments: comment._id } , dateModified: getFunction.today()}, { safe: true, upsert: true }, function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            //do stuff
        }
    });
    return {comment};
}