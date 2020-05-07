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

    if (getFunction.isEmpty(askID,answer)) return {error:'All field must be filled'}

    var existedFAQ=await FAQ.findOne({askID:askID});
    //find no faq of this ask
    if (existedFAQ!=null && existedFAQ!='') 
        return {error:'This question has been added to FAQ already'};

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

    return {success:'Create successfully'};

}

exports.removeFAQ = async function (faqID) {

    faqID=Objectid(faqID);
    var faq = await FAQ.findById(faqID);
    if (faq==null||faq=='') return {error:'FAQ not found'};
    await FAQ.deleteOne({_id:faqID});

    return {success:'Remove FAQ successfully'};

}

exports.getFAQ = async function(id){

    var faq = await FAQ.findById(Objectid(id)).populate('teacherID');
    if (faq==null||faq=='') return {error:'FAQ not found'};

    return faq;

}

exports.getAllFAQ = async function(page){

    return getResultOfPage(await FAQ.find().populate('teacherID'),page);

}

exports.getFAQByFilter = async function(teacherID,courseCode,page){
   
    if (getFunction.isEmpty(page)) return {error:'All field must be filled'}

    var faqs=await FAQ.find().populate('teacherID'),result=faqs;

    if (teacherID!='')
    {
        var teacher = await Teacher.findById(Objectid(teacherID));
        if (teacher==null||teacher=='') return {error:'Teacher not found'};
        result=faqs.filter(function(value){
            console.log('Compare '+teacherID+' with '+value.teacherID);
            return value.teacherID._id==teacherID;
        });
    }

    if (courseCode!='All FAQ')
    {
        result=result.filter(function(value){
            return value.courseCode==courseCode;
        });
    }

    return getResultOfPage(result,page);

}

exports.searchFAQ = async function(detail,courseCode,page){
    
    if (getFunction.isEmpty(page)) return {error:'All field must be filled'}

    var result;

    if (isNaN(detail))
        result = await FAQ.find({askContent:{$regex:detail,$options:"i"}}).populate('teacherID').lean();
    else
        result = await FAQ.find({$or:[{number:detail}
                                ,{askContent:{$regex:detail,$options:"i"}}]}).populate('teacherID').lean();

    if (courseCode!='All FAQ') result=result.filter(function(value){
        return value.courseCode==courseCode;
    });

    return getResultOfPage(result,page);

}

exports.getCourseForFAQ = async function(){

    var courses=await Course.find().lean();

    var all = {
        courseCode: 'All FAQ',
        courseName: 'All FAQ'
    }
    courses.unshift(all);

    return courses;
}