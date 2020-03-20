const Highlight = require('../models/Highlight');
const Student = require('../models/Student');
const Course = require('../models/Course');
const getFunction = require('./getFunction');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

async function checkStudent(studentID){
    try{
        studentID=Objectid(studentID);
    }
    catch{
        return -1;
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='')  return 0;
    return 1;
}

async function checkCourse(courseID){
    try {
        courseID=Objectid(courseID);
    }catch{
        return -1;
    }
    var course=await Course.findById(courseID);
    if (course==null||course=='') return 0;
}

async function checkHighlight(highlightID){
    try {
        highlightID=Objectid(highlightID);
    }catch{
        return -1;
    }
    var highlight=await Highlight.findById(highlightID);
    if (highlight==null||highlight=='') return 0;
}

//create a highlight
exports.createHighlight = async function(studentid,scannedContent,index,color,url,tags,course){

    var isStudent=await checkStudent(studentid);
    if (isStudent==-1) return makeJson('error','studentID not correct');
    else 
        if (isStudent==0) return makeJson('error','studentID not found');
    
    var isCourse=await checkCourse(course);
    if (isCourse==-1) return makeJson('error','courseID not correct');
    else 
        if (isCourse==0) return makeJson('error','courseID not found');
    
    var highlight = new Highlight({
        studentID: studentid,
        scannedContent: scannedContent,
        index: index,
        color: color,
        dateModified: getFunction.today(),
        url : url,
        tags: tags,
        course:course
    });
    await highlight.save();
    return makeJson('success','Create successfully');
}

//get highlight by id
exports.getHighlight = async function(id){
    //check highlighID
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','highlightID not correct');
    }
    var highlight=await Highlight.findById(id);
    if (highlight==null||highlight=='') return makeJson('error','highlightID not found');
    return highlight;
    
}

//get all highlight of a student by id
exports.getAllHighlightByStudentID = async function(studentID){

    var isStudent=await checkStudent(studentID);
    if (isStudent==-1) return makeJson('error','studentID not correct');
    else 
        if (isStudent==0) return makeJson('error','studentID not found');

    var highlights=Highlight.find({studentID:studentID});
    return highlights;
   
}

//delete a highlight
exports.deleteHighlight = async function(id){
    
    var isHL=await checkHighlight(id);
    if (isHL==-1) return makeJson('error','highlightID not correct');
    else 
        if (isHL==0) return makeJson('error','highlightID not found');
    
    await Highlight.deleteOne({_id:id},function(err){
        if (err) {
            return makeJson('error','Error when delete');
        }
    });
    return makeJson('success','Delete successfully');
}

//update a highlight
exports.updateHighlight = async function(hlID,course,scannedContent,index,color,tags){
    
    var isHL=await checkHighlight(hlID);
    if (isHL==-1) return makeJson('error','highlightID not correct');
    else 
        if (isHL==0) return makeJson('error','highlightID not found');

    var isCourse=await checkCourse(course);
    if (isCourse==-1) return makeJson('error','courseID not correct');
    else 
        if (isCourse==0) return makeJson('error','courseID not found');
   
    await Highlight.updateOne({_id:hlID},{course:course,scannedContent:scannedContent,index:index,color:color,tags:tags,dateModified:getFunction.today()});
    return makeJson('success','Update successfully');
}

//get highlight in an url
exports.getHighlightByUrl = async function(id,url){
    
    var isStudent=await checkStudent(id);
    if (isStudent==-1) return makeJson('error','studentID not correct');
    else 
        if (isStudent==0) return makeJson('error','studentID not found');

    var highlights=await Highlight.find({studentID:id,url:url});
    return highlights;
    
}

exports.searchHighlight = async function(scannedContent,sID){

    var isStudent=await checkStudent(sID);
    if (isStudent==-1) return makeJson('error','studentID not correct');
    else 
        if (isStudent==0) return makeJson('error','studentID not found');
    
    var result = await Highlight.find({scannedContent:{$regex:scannedContent,$options:"i"},studentID:sID}, 
                    function(err, docs) {
                        if (err) handleError(err);
                });
        return result;
    
}

exports.getHighlightByCourse = async function(course,sID){
    
    var isStudent=await checkStudent(sID);
    if (isStudent==-1) return makeJson('error','studentID not correct');
    else 
        if (isStudent==0) return makeJson('error','studentID not found');

    var isCourse=await checkCourse(course);
    if (isCourse==-1) return makeJson('error','courseID not correct');
    else 
        if (isCourse==0) return makeJson('error','courseID not found');
    var result = await Highlight.find({studentID:sID,course:course});
    return result;
}

exports.deleteHLByCourseID= async function(sID,course){
    
    var isStudent=await checkStudent(sID);
    if (isStudent==-1) return makeJson('error','studentID not correct');
    else 
        if (isStudent==0) return makeJson('error','studentID not found');
        
    var isCourse=await checkCourse(course);
    if (isCourse==-1) return makeJson('error','courseID not correct');
    else 
        if (isCourse==0) return makeJson('error','courseID not found');

    await Highlight.deleteMany({studentID:sID,course:course});
    return makeJson('success','Delete successfully');
}

exports.getHighlightByColor = async function(color,sID){
    
    var isStudent=await checkStudent(sID);
    if (isStudent==-1) return makeJson('error','studentID not correct');
    else 
        if (isStudent==0) return makeJson('error','studentID not found');

    var highlights=await Highlight.find({studentID:sID,color:color});
    return highlights;
}

exports.getRecentHighlight = async function(sID,limit){

    var isStudent=await checkStudent(sID);
    if (isStudent==-1) return makeJson('error','studentID not correct');
    else 
        if (isStudent==0) return makeJson('error','studentID not found');
    var highlights = await Highlight.find({studentID:sID});
    highlights.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });
    return highlights.slice(0,limit);
}
