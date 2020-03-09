const Highlight = require('../models/Highlight');
const Student = require('../models/Student');
const getTime = require('../dao/getTime');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//create a highlight
exports.createHighlight = async function(studentid,text,index,color,url,tags){
   
    studentid=Objectid(studentid);
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
        var highlight=await Highlight.findById(id);
        if (highlight==null||highlight=='') return makeJson('Error','highlightID not found');
        return highlight;
    }catch{
        return makeJson('Error','highlightID not correct');
    }
}

//get all highlight of a student by id
exports.getAllHighlightByStudentID = async function(studentID){
    //check studentID
    try{
        studentID=Objectid(studentID);
        var student=await Student.findById(studentID);
        if (student==null||student=='') return makeJson('Error','studentID not found');
        var highlights=Highlight.find({studentID:studentID});
        return highlights;
    }catch{
        return makeJson('Error','studentID not correct');
    }
}

//delete a highlight
exports.deleteHighlight = async function(id){
    //check highlightID
    try{
        id=Objectid(id);
        var highlight=await Highlight.findById(id);
        if (highlight==null||highlight=='') return makeJson('Error','highlightID not found');
    }catch{
        return makeJson('Error','highlightID not correct');
    }
    await Highlight.deleteOne({_id:id},function(err){
        if (err) {
            return makeJson('Error','Error when delete');
        }
    });
    return makeJson('Sucess','Delete successfully');
}

//update a highlight
exports.updateHighlight = async function(hlID,text,index,color,tags){
    //check highlightID
    try{
        hlID=Objectid(hlID);
        var highlight=await Highlight.findById(hlID);
        if (highlight==null||highlight=='') return makeJson('Error','highlightID not found');
    }catch{
        return makeJson('Error','highlightID not correct');
    }
    await Highlight.updateOne({_id:hlID},{text:text,index:index,color:color,tags:tags,date:getTime.today()});
    return makeJson('Success','Update successfully');
}

//get highlight in an url
exports.getHighlightOfUrl = async function(id,url){
    try{
        id=Objectid(id);
        var highlights=await Highlight.find({studentID:id,url:url});
        return highlights;
    }catch{
        return makeJson('Error','highlightID not correct');
    }
}