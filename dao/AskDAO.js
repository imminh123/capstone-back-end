var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const FAQ = require('../models/FAQ');
const Comment = require('../models/Comment');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const getFunction = require('./getFunction');

//return ask with new status after user read an ask
function newAsk(ask,status,answer,faqid){

    return {
        _id:ask._id,
        scannedContent:ask.scannedContent,
        askContent:ask.askContent,
        comments:ask.comments,
        student:ask.student,
        teacher:ask.teacher,
        courseID:ask.courseID,
        url:ask.url,
        dateModified:ask.dateModified,
        dateCreated:ask.dateCreated,
        status:status,
        rating:ask.rating,
        isClosed:ask.isClosed,
        answer:answer,
        faqID:faqid,
        date:ask.dateCreated
    }

}

//create new ask
exports.createAsk = async function(scannedContent,askContent,studentID,teacherID,courseID,url){

    askContent=askContent.trim();
    if (getFunction.isEmpty(scannedContent,askContent,studentID,teacherID,courseID)) return {error:'All field must be filled'}

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};
    
    teacherID=Objectid(teacherID);
    var teacher=await Student.findById(studentID);
    if (teacher==null||teacher=='') return {error:'Teacher not found'};

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
        studentLastCommentAt: today,
        teacherStatus: 'new',
        teacherLastCommentAt: today,
        rating: 0,
        isClosed: false
    });

    await ask.save();

    getFunction.sendEmail('student',teacher,'You got a new question',ask._id);

    return {success:'Create successfully'};

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

    var ask=await Ask.findById(id);
    if (ask==null||ask=='') return {error:'Question not found'};
    
    //delete all comments
    await deleteComments(ask.comments);

    //delete ask
    await Ask.deleteOne({_id:id});

    return {success:'Delete successfully'};

}

//get an ask by userid and askid
exports.getAskByID = async function(userID,askID){

    askID=Objectid(askID);
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return {error:'Question not found'};

    //if this ask had faq, return its answer, or else return empty answer
    var faq=await FAQ.findOne({askID:askID});
    var answer='',faqid='';
    if (faq!=null && faq!='') {
        answer=faq.answer;
        faqid=faq._id;
    }

    //check userID is teacher or student then update status accordingly
    if (userID==ask.teacher._id) {

        if (ask.teacherStatus=='new') {
            await Ask.updateOne({_id:askID},{teacherStatus:'seen'});
            ask.teacherStatus='seen';
        }

        return newAsk(ask,ask.teacherStatus,answer,faqid);

    } else if (userID==ask.student._id) {

        if (ask.studentStatus=='new') {
            await Ask.updateOne({_id:askID},{studentStatus:'seen'});
            ask.studentStatus='seen';
        }

        return newAsk(ask,ask.studentStatus,answer,faqid);

    } else {
        return {error:'You are not allowed to view this question'};
    }

}

//return all ask of a student by id
exports.allAskOfStudent = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};

    var asks = await Ask.find({student:studentID}).populate('student').populate('teacher').lean();
    
    //sort by recent date
    asks.sort(function(a,b){
        return Date.parse(b.teacherLastCommentAt)-Date.parse(a.teacherLastCommentAt);
    });

    return asks;

}

//return all ask of a teacher by id
exports.allAskOfTeacher = async function(teacherID){

    teacherID=Objectid(teacherID);
    var teacher=await Teacher.findById(teacherID);
    if (teacher==null||teacher=='') return {error:'Teacher not found'};

    var asks = await Ask.find({teacher:teacherID}).populate('student').populate('teacher').lean();
    
    //sort by recent date
    asks.sort(function(a,b){
        return Date.parse(b.studentLastCommentAt)-Date.parse(a.studentLastCommentAt);
    });

    return asks;

}

//return all ask
exports.allAsk = async function(){

    return await Ask.find().populate('student').populate('teacher');

}

//add a new comment to ask
exports.addComment = async function(askID,userID,message){

    message=message.trim();

    if (getFunction.isEmpty(message)) return {error:'Message cannot be empty'};

    askID=Objectid(askID);
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return {error:'Question not found'};

    //check input userID 
    if (userID!=ask.student._id && userID!=ask.teacher._id) return {error:'You are not allowed to comment on this question'};

    var now=getFunction.today();

    //create new comment
    var comment = new Comment({
        userID: userID,
        ask: askID,
        message: message,
        dateCreated: now
    });
    await comment.save();

    //push comment to ask and update user status
    if (userID==ask.student._id) {
        await Ask.findOneAndUpdate({_id: askID}, 
            {$addToSet:{comments:comment._id},
            dateModified:now,
            studentStatus:'replied',
            teacherStatus:'new',
            studentLastCommentAt: now}
        );
        getFunction.sendEmail('student',ask.teacher,'Student has replied to your answer',askID);   
    } else {
        await Ask.findOneAndUpdate({_id: askID}, 
            {$addToSet:{comments:comment._id},
            dateModified:now,
            teacherStatus:'replied',
            studentStatus:'new',
            teacherLastCommentAt: now
        }
        );
        getFunction.sendEmail('teacher',ask.student,'Teacher has replied to your question',askID);
    }

    return {comment};

}

exports.closeAsk=async function(askID,rating){

    askID=Objectid(askID);  
    var ask=await Ask.findById(askID);
    if (ask==null) return {error:'Question not found'};

    if (ask.isClosed) return {error:'Question was closed already'}

    //update ask status and rating
    await Ask.updateOne({_id:askID},{isClosed:true,rating:rating,dateModified:getFunction.today()});

    //find teacher and update rating
    var teacher=await Teacher.findById(ask.teacher);

    switch (rating){
        case '0': break;
        case '1': teacher.rating.star_1=teacher.rating.star_1+1;teacher.save();break;
        case '2': teacher.rating.star_2=teacher.rating.star_2+1;teacher.save();break;
        case '3': teacher.rating.star_3=teacher.rating.star_3+1;teacher.save();break;
        case '4': teacher.rating.star_4=teacher.rating.star_4+1;teacher.save();break;
        case '5': teacher.rating.star_5=teacher.rating.star_5+1;teacher.save();break;
    }

    return {success:'Close question successfully'};
    
}

exports.openAsk=async function(askID){
    
    askID=Objectid(askID);  
    var ask=await Ask.findById(askID);
    if (ask==null) return {error:'Question not found'};
    if (!ask.isClosed) return {error:'Question was open already'};

    var rating=ask.rating;
    //update ask status and rating
    if (rating!=0)
        await Ask.updateOne({_id:askID},{isClosed:false,rating:0,dateModified:getFunction.today()});

    //find teacher and update rating
    var teacher=await Teacher.findById(ask.teacher);

    switch (rating){
        case 0: break;
        case 1: teacher.rating.star_1=teacher.rating.star_1-1;teacher.save();break;
        case 2: teacher.rating.star_2=teacher.rating.star_2-1;teacher.save();break;
        case 3: teacher.rating.star_3=teacher.rating.star_3-1;teacher.save();break;
        case 4: teacher.rating.star_4=teacher.rating.star_4-1;teacher.save();break;
        case 5: teacher.rating.star_5=teacher.rating.star_5-1;teacher.save();break;
    }

    return {success:'Open question successfully'}
    
}

exports.searchAsk = async function(userID,text){

    if (getFunction.isEmpty(userID)) return {error:'All field must be filled'}

    //check if input user is student or teacher
    userID=Objectid(userID);
    var role='student';
    
    var user=await Student.findById(userID);
    if (user==null) {
        user=await Teacher.findById(userID);
        if (user==null) return {error:'User not found'};
        role='teacher';
    }



    if (role=='student'){
        var asks = await Ask.find({student:userID}).populate('student').populate('teacher').lean();
        var result = asks.filter(function(value, index, arr){
            
            return value.askContent.toLowerCase().includes(text.toLowerCase())
                || value.teacher.name.toLowerCase().includes(text.toLowerCase());
        });
        result.sort(function(a,b){
            return Date.parse(b.teacherLastCommentAt)-Date.parse(a.teacherLastCommentAt);
        });
    } else {
        //teacher
        var asks = await Ask.find({teacher:userID}).populate('student').populate('teacher').lean();
        var result = asks.filter(function(value, index, arr){
            return value.askContent.toLowerCase().includes(text.toLowerCase())
            || value.student.name.toLowerCase().includes(text.toLowerCase());
        });
        result.sort(function(a,b){
            return Date.parse(b.studentLastCommentAt)-Date.parse(a.studentLastCommentAt);
        });
    }

    return result;

}