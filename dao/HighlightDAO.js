var Objectid = require('mongodb').ObjectID;
const Folder = require('../models/Folder');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Highlight = require('../models/Highlight');
const getFunction = require('./getFunction');

async function newFolder(studentID,courseID,courseName,courseCode){
    var folder=new Folder({
        studentID:studentID,
        courseID:courseID,
        courseCode:courseCode,
        courseName:courseName
    });
    return await folder.save();
}

//create a highlight
exports.createHighlight = async function(studentID,scannedContent,index,color,url,folderID,startOffSet,endOffSet,courseID){

    if (getFunction.isEmpty(studentID,scannedContent,index,color,url)) return {error:'All field must be filled'}

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};

    //has course but not folder
    if (courseID!='' && folderID=='') {
        var course=await Course.findById(courseID);
        if (course==null||course=='') return {error:'Course not found'}
        var folder=await Folder.findOne({studentID:studentID,courseCode:course.courseCode});
        if (folder==null||folder=='') 
            var folder=await newFolder(studentID,courseID,course.courseName,course.courseCode);

    }
    else
    //has folder but not course
    if (courseID=='' && folderID!='') {
        var folder=await Folder.findById(folderID);
        if (folder==null||folder=='') return {error:'Folder not found'}
    } 
    //has none means default folder
    else {
        var folder=await Folder.findOne({studentID:studentID,courseCode:'Other',courseName:'Other'});
        if (folder==null||folder=='') {
            var folder=await newFolder(studentID,'','Other','Other');
        }
    }
    folderID=folder._id;
    
    var highlight = new Highlight({
        studentID: studentID,
        scannedContent: scannedContent,
        index: index,
        color: color,
        dateModified: getFunction.today(),
        url : url,
        folderID:folderID,
        startOffSet:startOffSet,
        endOffSet:endOffSet
    });

    await highlight.save();

    return {success:'Create successfully'};

}

//get highlight by id
exports.getHighlight = async function(id){

    id=Objectid(id);
    var highlight=await Highlight.findById(id);
    if (highlight==null||highlight=='') return {error:'Highlight not found'};

    return highlight;
    
}

//get all highlight of a student by id
exports.getAllHighlightByStudentID = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};

    return await Highlight.find({studentID:studentID});
   
}

//delete a highlight
exports.deleteHighlight = async function(id){

    id=Objectid(id);
    var highlight=await Highlight.findById(id);
    if (highlight==null||highlight=='') return {error:'Highlight not found'};
    
    await Highlight.deleteOne({_id:id});

    return {success:'Delete successfully'};

}

//update a highlight
exports.updateHighlight = async function(highlightID,scannedContent,index,color){
    
    if (getFunction.isEmpty(scannedContent,index,color)) return {error:'All field must be filled'}

    highlightID=Objectid(highlightID);
    var highlight=await Highlight.findById(highlightID);
    if (highlight==null||highlight=='') return {error:'Highlight not found'};
   
    await Highlight.updateOne({_id:highlightID},{scannedContent:scannedContent,index:index,color:color,dateModified:getFunction.today()});
    
    return {success:'Update successfully'};

}

//get highlight in an url
exports.getHighlightByUrl = async function(studentID,url){
    
    if (getFunction.isEmpty(studentID,url)) return {error:'All field must be filled'}
    
    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};

    return await Highlight.find({studentID:studentID,url:url});
    
}

exports.searchHighlight = async function(scannedContent,studentID,folderID){

    if (getFunction.isEmpty(scannedContent,studentID,folderID)) return {error:'All field must be filled'}

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};

    if (folderID.toString()=='all') {

        return await Highlight.find({scannedContent:{$regex:scannedContent,$options:"i"},
        studentID:studentID});

    } else {

        return await Highlight.find({scannedContent:{$regex:scannedContent,$options:"i"},
        studentID:studentID,folderID:Objectid(folderID)});

    }

}

exports.getHighlightByColor = async function(color,studentID,folderID){
    
    if (getFunction.isEmpty(studentID,folderID,color)) return {error:'All field must be filled'}
    
    studentID=Objectid(studentID);

    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};
    
    folderID=Objectid(folderID);
    var folder=await Folder.findById(folderID);
    if (folder==null||folder=='') return {error:'Folder not found'};

    return await Highlight.find({studentID:studentID,folderID:folderID,color:color}).sort({_id:-1});
}

exports.getRecentHighlight = async function(studentID,limit){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};

    var highlights = await Highlight.find({studentID:studentID});
    
    highlights.sort(function(a,b){
        return Date.parse(b.dateModified)-Date.parse(a.dateModified);
    });

    return highlights.slice(0,limit);
}
