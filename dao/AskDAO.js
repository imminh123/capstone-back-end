var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const FAQ = require('../models/FAQ');
const Comment = require('../models/Comment');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const getFunction = require('./getFunction');

//return ask with new status after user read an ask
function newAsk(ask,status,answer){

    var result = {
        _id:ask._id,
        comments:ask.comments,
        scannedContent:ask.scannedContent,
        askContent:ask.askContent,
        student:ask.student,
        teacher:ask.teacher,
        courseID:ask.courseID,
        url:ask.url,
        dateModified:ask.dateModified,
        dateCreated:ask.dateCreated,
        status:status,
        rating:ask.rating,
        isClosed:ask.isClosed,
        answer:answer
    }
    
    return result;
}

//create new ask
exports.createAsk = async function(scannedContent,askContent,studentID,teacherID,courseID,url){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return getFunction.makeJson('error','studentID not found');
    
    teacherID=Objectid(teacherID);
    var teacher=await Student.findById(studentID);
    if (teacher==null||teacher=='') return getFunction.makeJson('error','teacherID not found');

    var today=getFunction.today();

    var ask = new Ask({
        scannedContent:scannedContent,
        askContent:askContent,
        student:studentID,
        teacher:teacherID,
        courseID:courseID,
        url:url,
        comments:[],
        dateModified: today,
        dateCreated: today,
        studentStatus: 'seen',
        teacherStatus: 'new',
        rating: 0,
        isClosed: false
    });

    await ask.save();

    return getFunction.makeJson('success','Create successfully');

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
    if (ask==null||ask=='') return getFunction.makeJson('error','askID not found');
    
    //delete all comments
    await deleteComments(ask.comments);

    //delete ask
    await Ask.deleteOne({_id:id});

    return getFunction.makeJson('success','Delete successfully');

}

//get an ask by userid and askid
exports.getAskByID = async function(userID,askID){

    askID=Objectid(askID);
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return getFunction.makeJson('error','askID not found');

    //if this ask had faq, return its answer, or else return empty answer
    var faq=await FAQ.findOne({askID:askID});
    var answer='';
    if (faq!=null && faq!='') answer=faq.answer;

    //check userID is teacher or student then update status accordingly
    if (userID==ask.teacher._id) {

        if (ask.teacherStatus=='new') {
            await Ask.updateOne({_id:askID},{teacherStatus:'seen'});
            ask.teacherStatus='seen';
        }

        var result = newAsk(ask,ask.teacherStatus,answer);

    } else if (userID==ask.student._id) {

        if (ask.studentStatus=='new') {
            await Ask.updateOne({_id:askID},{studentStatus:'seen'});
            ask.studentStatus='seen';
        }

        var result = newAsk(ask,ask.studentStatus,answer);

    } else {
        return getFunction.makeJson('error','Access denied');
    }

    return result;

}

//return all ask of a student by id
exports.allAskOfStudent = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return getFunction.makeJson('error','studentID not found');

    var asks = await Ask.find({student:studentID}).populate('student').populate('teacher');
    
    var result=[];

    for (ask of asks){
        result.push(newAsk(ask,ask.studentStatus));
    }

    //sort by recent date
    result.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });

    return result;

}

//return all ask of a teacher by id
exports.allAskOfTeacher = async function(teacherID){

    teacherID=Objectid(teacherID);
    var teacher=await Teacher.findById(teacherID);
    if (teacher==null||teacher=='') return getFunction.makeJson('error','teacherID not found');

    var asks = await Ask.find({teacher:teacherID}).populate('student').populate('teacher');
    
    var result=[];

    for (ask of asks){
        result.push(newAsk(ask,ask.teacherStatus));
    }

    //sort by recent date
    result.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });

    return result;

}

//return all ask
exports.allAsk = async function(){

    return await Ask.find().populate('student').populate('teacher');

}

//add a new comment to ask
exports.addComment = async function(askID,userID,message){

    console.log(userID);
    askID=Objectid(askID);
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return getFunction.makeJson('error','askID not found');

    //check input userID 
    if (userID!=ask.student._id && userID!=ask.teacher._id) return getFunction.makeJson('error','UserID isnt match');

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
            {safe:true});
    } else {
        await Ask.updateOne({_id: askID}, 
            {$addToSet:{comments:comment._id},
            dateModified:getFunction.today(),
            teacherStatus:'replied',
            studentStatus:'new'},
            {safe:true});
    }

    return {comment};

}

exports.closeAsk=async function(askID,rating){

    askID=Objectid(askID);  
    var ask=await Ask.findById(askID);
    if (ask==null) return getFunction.makeJson('error','askID not found');

    //update ask status and rating
    await Ask.updateOne({_id:askID},{isClosed:true,rating:rating,dateModified:getFunction.today()});

    //find teacher and update rating
    var teacher=await Teacher.findById(ask.teacher);
    switch (rating){
        case 1: teacher.rating.star_1=teacher.rating.star_1+1;teacher.save();break;
        case 2: teacher.rating.star_2=teacher.rating.star_2+1;teacher.save();break;
        case 3: teacher.rating.star_3=teacher.rating.star_3+1;teacher.save();break;
        case 4: teacher.rating.star_4=teacher.rating.star_4+1;teacher.save();break;
        case 5: teacher.rating.star_5=teacher.rating.star_5+1;teacher.save();break;
    }

    return getFunction.makeJson('success','Close question successfully');
    
}

exports.openAsk=async function(askID){

    askID=Objectid(askID);  
    var ask=await Ask.findById(askID);
    if (ask==null) return getFunction.makeJson('error','askID not found');
    if (!ask.isClosed) return getFunction.makeJson('error','Question was open already');

    var rating=ask.rating;
    //update ask status and rating
    await Ask.findOneAndUpdate({_id:askID},{isClosed:false,rating:0,dateModified:getFunction.today()});

    //find teacher and update rating
    var teacher=await Teacher.findById(ask.teacher);
    switch (rating){
        case 1: teacher.rating.star_1=teacher.rating.star_1-1;teacher.save();break;
        case 2: teacher.rating.star_2=teacher.rating.star_2-1;teacher.save();break;
        case 3: teacher.rating.star_3=teacher.rating.star_3-1;teacher.save();break;
        case 4: teacher.rating.star_4=teacher.rating.star_4-1;teacher.save();break;
        case 5: teacher.rating.star_5=teacher.rating.star_5-1;teacher.save();break;
    }

    return getFunction.makeJson('success','Open question successfully');
    
}

exports.searchAsk = async function(userID,text){

    //check if input user is student or teacher
    userID=Objectid(userID);
    var role='student';
    
    var user=await Student.findById(userID);
    if (user==null) {
        user=await Teacher.findById(userID);
        if (user==null) return getFunction.makeJson('error','userID not found');
        role='teacher';
    }

    if (role=='student'){
        var asks = await Ask.find({student:userID}).populate('student').populate('teacher');
        var asks = asks.filter(function(value, index, arr){
            return value.askContent.toLowerCase().includes(text.toLowerCase())
                || value.teacher.name.toLowerCase().includes(text.toLowerCase());
        });
    } else {
        //teacher
        var asks = await Ask.find({teacher:userID}).populate('student').populate('teacher');
        var asks = asks.filter(function(value, index, arr){
            return value.askContent.toLowerCase().includes(text.toLowerCase())
            || value.student.name.toLowerCase().includes(text.toLowerCase());
        });
    }

    return asks;

}