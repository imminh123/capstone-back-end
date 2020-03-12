const Highlight = require('../models/Highlight');
const Student = require('../models/Student');
const Course = require('../models/Course');
const getTime = require('../dao/getTime');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//create a highlight
exports.createHighlight = async function(studentid,text,index,color,url,tags){
    try{studentid=Objectid(studentid);}
    catch{return makeJson('Error','studentID not correct')}
    var highlight = new Highlight({
        studentID: studentid,
        text: text,
        index: index,
        color: color,
        date: getTime.today(),
        url : url,
        tags: tags
    });
    await highlight.save();
    return makeJson('Sucess','Create successfully');
}

//get highlight by id
exports.getHighlight = async function(id){
    //check highlighID
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','highlightID not correct');
    }
        var highlight=await Highlight.findById(id);
        if (highlight==null||highlight=='') return makeJson('Error','highlightID not found');
        return highlight;
    
}

//get all highlight of a student by id
exports.getAllHighlightByStudentID = async function(studentID){
    //check studentID
    try{
        studentID=Objectid(studentID);
    }catch{
        return makeJson('Error','studentID not correct');
    }
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('Error','studentID not found');
        var highlights=Highlight.find({studentID:studentID});
        return highlights;
   
}

//delete a highlight
exports.deleteHighlight = async function(id){
    //check highlightID
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','highlightID not correct');
    }
        var highlight=await Highlight.findById(id);
        if (highlight==null||highlight=='') return makeJson('Error','highlightID not found');
    
    await Highlight.deleteOne({_id:id},function(err){
        if (err) {
            return makeJson('Error','Error when delete');
        }
    });
    return makeJson('Sucess','Delete successfully');
}

//update a highlight
exports.updateHighlight = async function(hlID,courseCode,text,index,color,tags){
    //check highlightID
    try{
        hlID=Objectid(hlID);
    }catch{
        return makeJson('Error','highlightID not correct');
    }
        var highlight=await Highlight.findById(hlID);
        if (highlight==null||highlight=='') return makeJson('Error','highlightID not found');
   
    await Highlight.updateOne({_id:hlID},{courseCode:courseCode,text:text,index:index,color:color,tags:tags,date:getTime.today()});
    return makeJson('Success','Update successfully');
}

//get highlight in an url
exports.getHighlightOfUrl = async function(id,url){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','highlightID not correct');
    }
        var student=await Student.findById(id);
        if (student==null||student=='') return makeJson('Error','studentID not found');
        var highlights=await Highlight.find({studentID:id,url:url});
        return highlights;
    
}

exports.searchHighlight = async function(text,sID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('Error','studentID not correct');
    }
        var result = await Highlight.find({text:{$regex:text,$options:"i"},studentID:sID}, 
                    function(err, docs) {
                        if (err) handleError(err);
                });
        return result;
    
}

exports.getHighlightByCourse = async function(courseCode,sID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('Error','studentID not correct');
    }
        var course = await Course.findOne({courseCode:courseCode});
        if (course==null||course=='') return makeJson('Error','courseCode not found');
        var result = await Highlight.find({studentID:sID,courseCode:courseCode});
        return result;
    
}