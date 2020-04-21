var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const FAQ = require('../models/FAQ');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const FAQCounter = require('../models/FAQCounter');

const getFunction = require('./getFunction');

const PERPAGE=10;
const FAQCOUNTERID = '5e9d6e33e7179a52a7619edd';


function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);

}

exports.createFAQ = async function (askID,answer) {

    var ask= await Ask.findById(Objectid(askID));

    var courseCode;
    if (ask.courseID=='') {
        courseCode='Other';
    }
    else {
        var course=await Course.findById(Objectid(ask.courseID));
        courseCode=course.courseCode;
    }

    var faqcounter=await FAQCounter.findById(FAQCOUNTERID);;
    await FAQCounter.updateOne({_id:FAQCOUNTERID},{number:faqcounter.number+1});

    var faq = new FAQ({
        number:faqcounter.number+1,
        askID:askID,
        courseCode:courseCode,
        teacherID:ask.teacher,  
        scannedContent:ask.scannedContent,
        askContent:ask.askContent,
        answer:answer,
        date:getFunction.today()
    });

    await faq.save();

    return makeJson('success','Create successfully');

}

exports.removeFAQ = async function (faqID) {

    faqID=Objectid(faqID);
    var faq = await FAQ.findById(faqID);
    if (faq==null||faq=='') return makeJson('error','FAQ not found');
    await FAQ.deleteOne({_id:faqID});

    return makeJson('success','Remove FAQ successfully');

}

exports.getFAQByTeacherID = async function(teacherID,page){

    var teacher = await Teacher.findById(Objectid(teacherID));
    if (teacher==null||teacher=='') return makeJson('error','teacherID not found');

    return await FAQ.find({teacherID:teacherID}).populate('teacherID')
                                        .skip(PERPAGE*(page-1))
                                        .limit(Number(PERPAGE));

}

exports.getFAQ = async function(id){

    var faq = await FAQ.findById(Objectid(id)).populate('teacherID');
    if (faq==null||faq=='') return makeJson('error','FAQ not found');

    return faq;

}

exports.getAllFAQ = async function(page){

    return await FAQ.find().populate('teacherID')
                        .skip(PERPAGE*(page-1))
                        .limit(Number(PERPAGE));

}

exports.getFAQByCourse = async function(courseCode,page){

    return await FAQ.find({courseCode:courseCode}).populate('teacherID')
                    .skip(PERPAGE*(page-1))
                    .limit(Number(PERPAGE));

}

exports.getFAQByNumber = async function(number){

    return await FAQ.findOne({number:number}).populate('teacherID');

}

exports.searchFAQ = async function(detail,page){
    
    var result;

    if (isNaN(detail))
        result = await FAQ.find({$or:[{courseCode:{$regex:detail,$options:"i"}}
                                ,{askContent:{$regex:detail,$options:"i"}}]}).populate('teacherID')
                                .skip(PERPAGE*(page-1))
                                .limit(Number(PERPAGE));
    else
        result = await FAQ.find({$or:[{number:detail}
                                ,{courseCode:{$regex:detail,$options:"i"}}
                                ,{askContent:{$regex:detail,$options:"i"}}]}).populate('teacherID')
                                .skip(PERPAGE*(page-1))
                                .limit(Number(PERPAGE));
    return result;

}