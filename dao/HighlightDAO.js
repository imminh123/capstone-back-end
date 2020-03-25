const Highlight = require('../models/Highlight');
const Student = require('../models/Student');
const Course = require('../models/Course');
const getFunction = require('./getFunction');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//create a highlight
exports.createHighlight = async function(studentID,scannedContent,index,color,url,tags,folderID){

    //check student
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    
    //check student
    try{
        folderID=Objectid(folderID);
    }catch{
        return makeJson('error','folderID not correct');
    }
    var folder=await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');
    
    var highlight = new Highlight({
        studentID: studentID,
        scannedContent: scannedContent,
        index: index,
        color: color,
        dateModified: getFunction.today(),
        url : url,
        tags: tags,
        folderID:folderID
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

    //check student
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    return await Highlight.find({studentID:studentID});
   
}

//delete a highlight
exports.deleteHighlight = async function(id){
    
    //check highlighID
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','highlightID not correct');
    }
    var highlight=await Highlight.findById(id);
    if (highlight==null||highlight=='') return makeJson('error','highlightID not found');
    
    await Highlight.deleteOne({_id:id});
    return makeJson('success','Delete successfully');
}

//update a highlight
exports.updateHighlight = async function(hlID,folderID,scannedContent,index,color,tags){
    
    //check highlighID
    try{
        hlID=Objectid(hlID);
    }catch{
        return makeJson('error','highlightID not correct');
    }
    var highlight=await Highlight.findById(hlID);
    if (highlight==null||highlight=='') return makeJson('error','highlightID not found');

    //check student
    try{
        folderID=Objectid(folderID);
    }catch{
        return makeJson('error','folderID not correct');
    }
    var folder=await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');
   
    await Highlight.updateOne({_id:hlID},{folderID:folderID,scannedContent:scannedContent,index:index,color:color,tags:tags,dateModified:getFunction.today()});
    return makeJson('success','Update successfully');
}

//get highlight in an url
exports.getHighlightByUrl = async function(studentID,url){
    
    //check student
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    return await Highlight.find({studentID:studentID,url:url});
    
}

exports.searchHighlight = async function(scannedContent,studentID){

    //check student
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    
    var result = await Highlight.find({scannedContent:{$regex:scannedContent,$options:"i"},studentID:studentID});
    return result;
}

exports.getHighlightByColor = async function(color,studentID,folderID){
    
    //check student
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    
    //check student
    try{
        folderID=Objectid(folderID);
    }catch{
        return makeJson('error','folderID not correct');
    }
    var folder=await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    return await Highlight.find({studentID:studentID,folderID:folderID,color:color});
}

exports.getRecentHighlight = async function(studentID,limit){

   //check student
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('error','studentID not correct');
    }
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var highlights = await Highlight.find({studentID:studentID});
    highlights.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });
    return highlights.slice(0,limit);
}
