var Objectid = require('mongodb').ObjectID;
const Folder = require('../models/Folder');
const Student = require('../models/Student');
const Highlight = require('../models/Highlight');
const getFunction = require('./getFunction');

function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);

}

//create a highlight
exports.createHighlight = async function(studentID,scannedContent,index,color,url,tags,folderID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    folderID=Objectid(folderID);
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

    id=Objectid(id);
    var highlight=await Highlight.findById(id);
    if (highlight==null||highlight=='') return makeJson('error','highlightID not found');

    return highlight;
    
}

//get all highlight of a student by id
exports.getAllHighlightByStudentID = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    return await Highlight.find({studentID:studentID});
   
}

//delete a highlight
exports.deleteHighlight = async function(id){
    
    id=Objectid(id);
    var highlight=await Highlight.findById(id);
    if (highlight==null||highlight=='') return makeJson('error','highlightID not found');
    
    await Highlight.deleteOne({_id:id});

    return makeJson('success','Delete successfully');

}

//update a highlight
exports.updateHighlight = async function(highlightID,folderID,scannedContent,index,color,tags){
    
    highlightID=Objectid(highlightID);
    var highlight=await Highlight.findById(highlightID);
    if (highlight==null||highlight=='') return makeJson('error','highlightID not found');

    folderID=Objectid(folderID);
    var folder=await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');
   
    await Highlight.updateOne({_id:highlightID},{folderID:folderID,scannedContent:scannedContent,index:index,color:color,tags:tags,dateModified:getFunction.today()});
    
    return makeJson('success','Update successfully');

}

//get highlight in an url
exports.getHighlightByUrl = async function(studentID,url){
    
    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    return await Highlight.find({studentID:studentID,url:url});
    
}

exports.searchHighlight = async function(scannedContent,studentID,folderID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    
    if (folderID.toString=='all') {

        var result = await Highlight.find({scannedContent:{$regex:scannedContent,$options:"i"},
        studentID:studentID});

    } else {

        var result = await Highlight.find({scannedContent:{$regex:scannedContent,$options:"i"},
        studentID:studentID,folderID:Objectid(folderID)});
        
    }

    return result;
}

exports.getHighlightByColor = async function(color,studentID,folderID){
    
    studentID=Objectid(studentID);

    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');
    
    folderID=Objectid(folderID);
    var folder=await Folder.findById(folderID);
    if (folder==null||folder=='') return makeJson('error','folderID not found');

    return await Highlight.find({studentID:studentID,folderID:folderID,color:color});
}

exports.getRecentHighlight = async function(studentID,limit){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return makeJson('error','studentID not found');

    var highlights = await Highlight.find({studentID:studentID});
    
    highlights.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });

    return highlights.slice(0,limit);
}
