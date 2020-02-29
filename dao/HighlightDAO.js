const mongoose = require('mongoose');
const Highlight = require('../models/Highlight');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.createHighlight = async function(studentid,text,index,color,url){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    studentid=Objectid(studentid);
    var highlight = new Highlight({
        studentID: studentid,
        text: text,
        index: index,
        color: color,
        date: today,
        url : url
    });
    await highlight.save();
    return makeJson('Sucess','Create successfully');
}
