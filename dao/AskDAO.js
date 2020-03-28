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

//get an ask by id
exports.getAskByID = async function(userID,askID){

    askID=Objectid(askID);
    var ask=await Ask.findById(askID).populate('student').populate('teacher').populate('comments');
    if (ask==null||ask=='') return makeJson('error','askID not found');

    //check userID is teacher or student then update status accordingly
    //not done

    return ask;
}

//return all ask of a student by id
exports.allAskOfStudent = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    return await Ask.find({student:studentID}).populate('student').populate('teacher');
    
}

//return all ask of a teacher by id
exports.allAskOfTeacher = async function(teacherID){

    teacherID=Objectid(teacherID);
    var teacher=await Teacher.findById(teacherID);
    if (teacher==null||teacher=='') return makeJson('error','teacherID not found');

    return await Ask.find({teacher:teacherID}).populate('student').populate('teacher');
    
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

    //push comment to ask
    await Ask.updateOne({_id: askID}, 
        {$addToSet:{comments:comment._id},dateModified:getFunction.today()},{safe:true,upsert:true});

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

        var result = await Ask.find({
            student:userID,
            $or:[{askContent:{$regex:text,$options:"i"}},
                  {teacher:{$regex:text,$options:"i"}}
                ]
        });

    }


}