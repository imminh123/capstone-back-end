var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const getFunction = require('./getFunction');

exports.getTeacherDashboard=async function(teacherID){

    var teacher = await Teacher.findOne({_id:teacherID}).populate('courses');
    if (teacher==null||teacher=='') return {error:'Teacher not found'};

    var courses=teacher.courses;

    var asks=await Ask.find({teacher:teacherID});
    var total=asks.length,closed=0;
    for (ask of asks) if (ask.isClosed) closed++;
    var open=total-closed;

    return {
        totalQuestion: total,
        openQuestion: open,
        closedQuestion: closed,
        courses: courses
    }

}

exports.allTeacherByCourse=async function(courseID){

    courseID=Objectid(courseID);
    var course=await Course.findById(courseID);
    if (course==null||course=='') return {error:'Teacher not found'};

    return await Teacher.find({courses:courseID});

}

//create teacher
exports.createTeacher = async function(name,email,gender,avatar){

    var teacher=await Teacher.findOne({email:email});
    if (!(teacher==null||teacher=='')) return {error:'Email already existed'};
    
    teacher = new Teacher({
        name:name,
        email:email,
        rating:{
            star_1:0,
            star_2:0,
            star_3:0,
            star_4:0,
            star_5:0
        },
        courses:[],
        gender:gender,
        avatar:avatar,
        isActive:true
    });
    await teacher.save();

    return teacher;

}

//get all teacher
exports.getAllTeacher = async function () {

    return await Teacher.find({}).populate('courses');

};

//get a teacher by id
exports.getTeacherByID = async function(id){

    id = Objectid(id);
    var teacher = await Teacher.findOne({_id:id}).populate('courses');
    if (teacher==null||teacher=='') return {error:'Teacher not found'};

    return teacher;

};

//update a teacher
exports.updateTeacher = async function(id,name,email,isActive){

    id=Objectid(id);
    var teacher = await Teacher.find({_id:id});
    if (teacher==null||teacher=='') return {error:'Teacher not found'};

    await Teacher.updateOne({_id:id},{name:name,email:email,isActive:isActive});

    return {success:'Update successfully'};

};

exports.changeteacherisactive = async function(id,isActive){

    id=Objectid(id);
    var teacher=await Teacher.find({_id:id});
    if (teacher==null||teacher=='') return {error:'Teacher not found'};

    await Teacher.updateOne({_id:id},{isActive:isActive});

    return {success:'Update successfully'};
}

//search teacher name and email
exports.searchTeacher = async function(page,perPage,detail){

    if (getFunction.isEmpty(page,perPage)) return {error:'All field must be filled'}

    var result,size;
    result = await Teacher.find({$or:[{name:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}).populate('courses');
    
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    
    //result of a page
    if (page!=0){
        result = await Teacher.find({$or:[{name:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}).populate('courses')
                                .skip(perPage*(page-1))
                                .limit(Number(perPage));
    }

    return {
        totalPage:size,
        result:result
    };
    
}