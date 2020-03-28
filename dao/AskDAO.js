var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const Comment = require('../models/Comment');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const getFunction = require('./getFunction');


function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);

}

function newAsk(ask,status){
    var result = {
        _id:ask._id,
        comments:ask.comments,
        scannedContent:ask.scannedContent,
        askContent:ask.askContent,
        student:ask.student,
        teacher:ask.teacher,
        courseURL:ask.courseURL,
        dateModified:ask.dateModified,
        dateCreated:ask.dateCreated,
        status:status,
        rating:ask.rating,
        isClosed:ask.isClosed
    }
    return result;
}

//create new ask
exports.createAsk = async function(scannedContent,askContent,studentID,teacherID,courseURL){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    
    teacherID=Objectid(teacherID);
    var teacher=await Student.findById(studentID);
    if (teacher==null||teacher=='') return makeJson('error','teacherID not found');

    var today=getFunction.today();

    var ask = new Ask({
        scannedContent:scannedContent,
        askContent:askContent,
        student:studentID,
        teacher:teacherID,
        courseURL:courseURL,
        comments:[],
        dateModified: today,
        dateCreated: today,
        studentStatus: 'seen',
        teacherStatus: 'new',
        rating: 0,
        isClosed: false
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

    id=Objectid(id);
    var ask=await Ask.findById(id);
    if (ask==null||ask=='') return makeJson('error','askID not found');
    
    //delete all comments
    await deleteComments(ask.comments);

    //delete ask
    await Ask.deleteOne({_id:id});

    return makeJson('success','Delete successfully');

}

//get an ask by userid and askid
exports.getAskByID = async function(userID,askID){

    askID=Objectid(askID);
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return makeJson('error','askID not found');

    //check userID is teacher or student then update status accordingly
    if (userID==ask.teacher._id) {

        if (ask.teacherStatus=='new') {
            await Ask.updateOne({_id:askID},{teacherStatus:'seen'});
            ask.teacherStatus='seen';
        }

        var result = newAsk(ask,ask.teacherStatus);

    } else if (userID==ask.student._id) {

        if (ask.studentStatus=='new') {
            await Ask.updateOne({_id:askID},{studentStatus:'seen'});
            ask.studentStatus='seen';
        }

        var result = newAsk(ask,ask.studentStatus);

    } else {
        return makeJson('error','userID not match');
    }

    return result;

}

//return all ask of a student by id
exports.allAskOfStudent = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var asks = await Ask.find({student:studentID}).populate('student').populate('teacher');
    
    var result=[];

    for (ask of asks){
        result.push(newAsk(ask,ask.studentStatus));
    }

    return result;

}

//return all ask of a teacher by id
exports.allAskOfTeacher = async function(teacherID){

    teacherID=Objectid(teacherID);
    var teacher=await Teacher.findById(teacherID);
    if (teacher==null||teacher=='') return makeJson('error','teacherID not found');

    var asks = await Ask.find({teacher:teacherID}).populate('student').populate('teacher');
    
    var result=[];

    for (ask of asks){
        result.push(newAsk(ask,ask.teacherStatus));
    }

    return result;

}

//return all ask
exports.allAsk = async function(){

    return await Ask.find().populate('student').populate('teacher');

}

//add a new comment to ask
exports.addComment = async function(askID,userID,message){

    askID=Objectid(askID);
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

    //push comment to ask and update user status
    if (userID==ask.student._id) {
        await Ask.updateOne({_id: askID}, 
            {$addToSet:{comments:comment._id},
            dateModified:getFunction.today(),
            studentStatus:'replied',
            teacherStatus:'new'},
            {safe:true,upsert:true});
    } else {
        await Ask.updateOne({_id: askID}, 
            {$addToSet:{comments:comment._id},
            dateModified:getFunction.today(),
            teacherStatus:'replied',
            studentStatus:'new'},
            {safe:true,upsert:true});
    }
    

    return {comment};

}

exports.closeAsk=async function(askID,rating){

    askID=Objectid(askID);  
    var ask=await Ask.findById(askID);
    if (ask==null) return makeJson('error','askID not found');

    //update ask status and rating
    Ask.updateOne({_id:askID},{status:'closed',rating:rating});

    //find teacher and update rating
    var teacher=await Teacher.findById(ask.teacher);
    switch (rating){
        case 1: teacher.rating.star_1=teacher.rating.star_1+1;teacher.save();break;
        case 2: teacher.rating.star_2=teacher.rating.star_2+1;teacher.save();break;
        case 3: teacher.rating.star_3=teacher.rating.star_3+1;teacher.save();break;
        case 4: teacher.rating.star_4=teacher.rating.star_4+1;teacher.save();break;
        case 5: teacher.rating.star_5=teacher.rating.star_5+1;teacher.save();break;
    }

    return makeJson('success','Close question successfully');
    
}

exports.searchAsk = async function(userID,text){

    userID=Objectid(userID);
    var role='student';
    
    var user=await Student.findById(userID);
    if (user==null) {
        user=await Teacher.findById(userID);
        if (user==null) return makeJson('error','userID not found');
        role='teacher';
    }

    if (role=='student'){
        var asks = await Ask.find({student:userID}).populate('student').populate('teacher');
    } else {
        //teacher
        var asks = await Ask.find({teacher:userID}).populate('student').populate('teacher');
    }

    //this is a slower way. best to find a query to handle this in one go
    if (role=='student') {
        var asks = asks.filter(function(value, index, arr){

            return getFunction.change_alias(value.askContent).includes(text.toLowerCase())
                || getFunction.change_alias(value.teacher.name).includes(text.toLowerCase());

        });
    } else {
        var asks = asks.filter(function(value, index, arr){

            return getFunction.change_alias(value.askContent).includes(text.toLowerCase())
                || getFunction.change_alias(value.student.name).includes(text.toLowerCase());

                });
    }

    return asks;

}