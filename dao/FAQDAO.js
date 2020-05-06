var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const FAQ = require('../models/FAQ');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const FAQCounter = require('../models/FAQCounter');

const getFunction = require('./getFunction');

const PERPAGE=10;
const FAQCOUNTERID = '5e9d6e33e7179a52a7619edd';

function getResultOfPage(result,page){
    var size=Math.ceil(result.length/PERPAGE);

    result.sort(function(a,b){
        return a.courseCode.localeCompare(b.courseCode);
    });

    return {
        totalPage:size,
        result:result
    }

}

exports.createFAQ = async function (askID,answer) {

    var existedFAQ=await FAQ.findOne({askID:askID});
    //find no faq of this ask
    if (existedFAQ!=null && existedFAQ!='') 
        return getFunction.makeJson('error','This question has been added to FAQ already');

    var ask= await Ask.findById(Objectid(askID));

    //check if faq.course was deleted
    var courseCode;
    if (ask.courseID=='') {
        courseCode='';
    }
    else {
        var course=await Course.findById(Objectid(ask.courseID));
        courseCode=course.courseCode;
    }

    //update faq counter
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

    var faqs=await FAQ.find({number:faq.number});
    if (faqs.length!=1) FAQ.deleteOne({number:faq.number});

    return getFunction.makeJson('success','Create successfully');

}

exports.removeFAQ = async function (faqID) {

    faqID=Objectid(faqID);
    var faq = await FAQ.findById(faqID);
    if (faq==null||faq=='') return getFunction.makeJson('error','FAQ not found');
    await FAQ.deleteOne({_id:faqID});

    return getFunction.makeJson('success','Remove FAQ successfully');

}

exports.getFAQ = async function(id){

    var faq = await FAQ.findById(Objectid(id));
    if (faq==null||faq=='') return getFunction.makeJson('error','FAQ not found');

    return faq;

}

exports.getAllFAQ = async function(page){

    return getResultOfPage(await FAQ.find(),page);

}

exports.getFAQByFilter = async function(teacherID,courseCode,page){
   
    var faqs=await FAQ.find(),result=faqs;

    if (teacherID!='')
    {
        var teacher = await Teacher.findById(Objectid(teacherID));
        if (teacher==null||teacher=='') return getFunction.makeJson('error','Teacher not found');
        result=faqs.filter(function(value){
            return value.teacherID==teacherID;
        });
    }

    if (courseCode!='')
    {
        result=result.filter(function(value){
            return value.courseCode==courseCode;
        });
    }

    return getResultOfPage(result,page);

}

exports.searchFAQ = async function(detail,courseCode,page){
    
    var result;

    if (isNaN(detail))
        result = await FAQ.find({askContent:{$regex:detail,$options:"i"}}).lean();
    else
        result = await FAQ.find({$or:[{number:detail}
                                ,{askContent:{$regex:detail,$options:"i"}}]}).lean();

    if (courseCode!='') result=result.filter(function(value){
        return value.courseCode==courseCode;
    });

    return getResultOfPage(result,page);

}

exports.getCourseForFAQ = async function(){

    var courses=await Course.find().lean();

    var all = {
        courseCode: '',
        courseName: 'All'
    }
    courses.push(all);

    return courses;
}