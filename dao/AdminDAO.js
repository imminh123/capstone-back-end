const Ask = require('../models/Ask');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
    
}

exports.createAdmin = async function(adminName,email,gender,avatar){

    var admin=await Admin.findOne({email:email});
    if (!(admin==null||admin=='')) return makeJson('error','Email already existed');

    admin = new Admin({
        name:adminName,
        email:email,
        gender:gender,
        avatar:avatar
    });
    await admin.save();

    return admin;

}

//get number of teacher, course, and active teacher
exports.getAllNumber = async function () {

    var newObject = '{"numOfTeacher":'+await Teacher.count({})
                        +',"numOfCourse":'+await Course.count({})
                        +',"numOfActiveTeacher":'+await Teacher.count({isActive:true})+'}';

    return JSON.parse(newObject);

}

function getOneReport(teacher,course,asks){

    var rating=0,answered=0,count=0,haveRate=0;

    //get average rating of this course
    for (ask of asks) {
        if (ask.courseID==course._id && ask.teacher.toString()==teacher._id) {
            count++;
            if (ask.isClosed) {
                if (rating!=0) {
                    rating+=ask.rating;
                    haveRate++;
                }
                answered++;
            }
        }
    }

    rating=rating/haveRate;

    var newOb={
        teacherName:teacher.name,
        teacherEmail:teacher.email,
        teacherAvatar:teacher.avatar,
        courseName:course.courseName,
        courseCode:course.courseCode,
        closed:answered,
        open:count-answered,
        rating:rating
    }

    return newOb;

}

async function getTeacherOfReport(teacherID){
    
    if (teacherID=='') {
        var teachers=await Teacher.find({});
    }
    else {
        var teachers=await Teacher.find({_id:teacherID});
    }
    return teachers;
}

async function getCourseOfReport(courseID){

    if (courseID=='') {
        var courses=await Course.find({});
    }
    else {
        var courses=await Course.find({_id:courseID}).lean();
        if (courses=='') return makeJson('error','Course not found');
    }

    return courses;

}

function getCourseIDList(courseID,courses){

    var courseIDlist=[];
    if (courseID==''){
        
        for (course of courses) {
            courseIDlist.push(course._id);
        }

        var emptyString='';
        courseIDlist.push(emptyString);
    }
    else courseIDlist.push(courseID);

    return courseIDlist;

}

function getReportStartDate(from){

    if (from=='') {
        from = 'Thu Jan 01 1970 00:00:00';
    } else {
        from=from+' 00:00:00';
    }
    return from;

}

function getReportEndDate(to){

    if (to=='') {
        to=new Date();
        to.setHours(23,59,59);
    } else {
        to=to+' 23:59:59';
    }
    return to;

}

exports.getReport = async function(teacherID,courseID,from,to){

    var result=[];

    var teachers=await getTeacherOfReport(teacherID);

    var courses=await getCourseOfReport(courseID);

    var courseIDlist=getCourseIDList(courseID,courses);

    from=getReportStartDate(from);

    to=getReportEndDate(to);

    //filter ask only of all chosen teachers
    var asks=await Ask.find({teacher:teachers,courseID:courseIDlist});

    asks = asks.filter(function(value, index, arr){
        return Date.parse(value.dateCreated)>=Date.parse(from)
                && Date.parse(value.dateCreated)<=Date.parse(to);
    });

    for (teacher of teachers) {
        for (course of courses) {
            if (teacher.courses.includes(course._id))
                result.push(getOneReport(teacher,course,asks));
        }
        if (courseID=='') {
            report=getOneReport(teacher,{_id:'',courseName:'Other',courseCode:'Other'},asks);
            if (report.closed!=0 || report.open!=0) result.push(report);
        }
            
    }

    return result;

}