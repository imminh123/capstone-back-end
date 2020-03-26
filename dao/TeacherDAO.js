var Objectid = require('mongodb').ObjectID;
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');


function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.allTeacherByCourse=async function(courseID){
    //check courseID
    try{
        courseID=Objectid(courseID);
    }catch{
        return makeJson('error','Course ID not correct');
    }
    var course=await Course.findById(courseID);
    if (course==null||course=='') return makeJson('error','ID not found');
    return await Teacher.find({courses:courseID});
}

//create teacher
exports.createTeacher = async function(name,email,gender,avatar){
    var teacher=await Teacher.findOne({email:email});
    if (!(teacher==null||teacher=='')) return makeJson('error','Email already existed');
    
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
    //check teacherID
    try{
        id = Objectid(id);
    }catch{
        return makeJson('error','Teacher ID not correct');
    }
    var teacher = await Teacher.findOne({_id:id}).populate('courses');
    if (teacher==null||teacher=='') return makeJson('error','Teacher ID not found')
    else
    return teacher;
};

//update a teacher
exports.updateTeacher = async function(id,name,email,isActive){
    //check teacherID
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','Teacher ID not correct');
    }
        var teacher = await Teacher.find({_id:id});
        if (teacher==null||teacher=='') return makeJson('error','Teacher ID not found');
        await Teacher.updateOne({_id:id},{name:name,email:email,isActive:isActive});
        //remove this teacher from every course
        // await Course.updateMany(
        //     {},
        //     {$pull: {teachers: id}},
        //     {safe: true, upsert: true}
        // );
        // //add this teacher to new course
        // courses.forEach(async function(data){
        //     var courseid=Objectid(data);
        //     await Course.updateOne({_id:courseid},
        //         {$addToSet: {teachers:id}},
        //         {safe: true, upsert: true},
        //     );
        // });
    return makeJson('success','Update successfully');
};

//change active of teacher
exports.changeteacherisactive = async function(id,isActive){
    //check teacherID
    try{
        id=Objectid(id);
    }
    catch{
        return makeJson('error','Teacher ID not correct');
    }
    var teacher=await Teacher.find({_id:id});
    if (teacher==null||teacher=='') return makeJson('error','Teacher ID not found');
    await Teacher.updateOne({_id:id},{isActive:isActive});
    return makeJson('success','Update successfully');
}

//search teacher name and email
exports.searchTeacher = async function(page,perPage,detail){
    var result,size;
    //all result. may need a better solution
    result = await Teacher.find({$or:[{name:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}).populate('courses');
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    //result of a page
    if (page!=0){
        result = await Teacher.find({$or:[{name:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}).populate('courses')
                                .skip(perPage*(page-1))
                                .limit(Number(perPage));
    }
    result=JSON.stringify(result);
    result='{"totalPage":'+size+',"result":'+result+'}';
    return result;
}