var Objectid = require('mongodb').ObjectID;
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.getAllTeacher = async function () {
    var teacherlist = await Teacher.find({}).populate('courses');
    return teacherlist;
};

exports.getTeacherByID = async function(id){
    try{
        id = Objectid(id);
        var teacher = await Teacher.findOne({_id:id}).populate('courses');
        if (teacher==null||teacher=='') return makeJson('Error','Teacher ID not found')
        else
            return teacher;
    }catch{
        return makeJson('Error','Teacher ID not correct');
    }
};

exports.updateTeacher = async function(id,name,email,isActive){
    try{
        id=Objectid(id);
        var teacher = await Teacher.find({_id:id});
        console.log(teacher=='');
        if (teacher==null||teacher=='') return makeJson('Error','Teacher ID not found');
        await Teacher.updateOne({_id:id},{teacherName:name,email:email,isActive:isActive});
        //remove this teacher from every course
        // await Course.updateMany(
        //     {},
        //     {$pull: {teachers: id}},
        //     {safe: true, upsert: true},
        //     function(err, doc) {
        //         if(err){
        //             // console.log(err);
        //             return makeJson('There was an error with courses');
        //         }else{
        //         //do stuff
        //         }
        //     }
        // );
        // //add this teacher to new course
        // courses.forEach(async function(data){
        //     var courseid=Objectid(data);
        //     await Course.updateOne({_id:courseid},
        //         {$addToSet: {teachers:id}},
        //         {safe: true, upsert: true},
        //         function(err, doc) {
        //             if(err){
        //                 // console.log(err);
        //                 return makeJson('There was an error with courses');
        //             }else{
        //             //do stuff
        //             }
        //         }
        //     );
        // });
        return makeJson('Success','Update successfully');
    }catch{
        return makeJson('Error','Teacher ID not correct');
    }
};

exports.changeteacherisactive = async function(id,isActive){
    try{
        id=Objectid(id);
        var teacher=await Teacher.find({_id:id});
        if (teacher==null||teacher=='') return makeJson('Error','Teacher ID not found');
        await Teacher.updateOne({_id:id},{isActive:isActive});
        return makeJson('Sucess','Update successfully');
    }
    catch{
        return makeJson('Error','Teacher ID not correct');
    }
}

exports.searchTeacher = async function(page,perPage,detail){
    var result,size;
    result = await Teacher.find({$or:[{teacherName:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}, 
                            function(err, docs) {
                                if (err) handleError(err);
                                }).populate('courses');
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    if (page!=0){
        result = await Teacher.find({$or:[{teacherName:{$regex:detail,$options:"i"}},{email:{$regex:detail,$options:"i"}}]}, 
                            function(err, docs) {
                                if (err) handleError(err);
                                }).populate('courses')
                                .skip(perPage*(page-1))
                                .limit(Number(perPage));
    }
    result=JSON.stringify(result);
    result='{"totalPage":'+size+',"result":'+result+'}';
    return result;
}