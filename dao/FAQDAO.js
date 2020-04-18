var Objectid = require('mongodb').ObjectID;
const FAQ = require('../models/FAQ');
const Teacher = require('../models/Teacher');

function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);

}

exports.createFAQ = async function (teacherID,askID,scannedContent,askContent,answer) {

    var faq = new FAQ({
        teacherID:teacherID,
        askID:askID,
        scannedContent:scannedContent,
        askContent:askContent,
        answer:answer
    });

    await faq.save();

    return makeJson('success','Create successfully');

}

exports.removeFAQ = async function (faqID) {

    var faq = await FAQ.findById(Objectid(faqID));
    if (faq==null||faq=='') return makeJson('error','FAQ not found');

    return makeJson('success','Remove FAQ successfully');

}

exports.getFAQByTeacherID = async function(teacherID){

    var teacher = await Teacher.findById(Objectid(teacherID));
    if (teacher==null||teacher=='') return makeJson('error','teacherID not found');

    return await FAQ.find({teacherID:teacherID});

}

exports.getFAQ = async function(id){

    var faq = await FAQ.findById(Objectid(id));
    if (faq==null||faq=='') return makeJson('error','FAQ not found');

    return faq;

}