const mongoose = require('mongoose');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

//check if code has already existed
async function existed(id,code){
    const course=await Course.findOne({courseCode:code},function (err){
        if (err) {
            // console.log(err);
            return 0;
        }
    });
    //if no course was found. Or a course was found but code is unchanged
    if (course==null || course._id==id) {
        return 0;
    }
    return 1;
};
  
//remove this course from every teacher
async function removeCourseFromTeacher(id){
    await Teacher.updateMany(
        {},
        {$pull: {courses:id}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            // console.log(err);
            }else{
            //do stuff
            }
        }
    );
};

//add this course to new teacher
async function addCourseToTeacher(courseid,teachers){
    teachers.forEach(async function (data) {
            var teacherid = Objectid(data);
            await Teacher.updateOne({ _id: teacherid }, { $addToSet: { courses: courseid } }, { safe: true, upsert: true }, function (err, doc) {
                if (err) {
                    // console.log(err);
                }
                else {
                    //do stuff
                }
            });
        });
};

exports.getAllCourse = async function () {
    var courselist = await Course.find({}).populate('teachers');
    return courselist;
};

exports.getCourseByID = async function(id){
    try{
        id=Objectid(id);
        var course = await Course.find({_id:id}).populate('teachers');
        if (course==null||course=='') return makeJson('Error','Course ID not found');
        return course;
    }catch{
        return makeJson('Error','Course ID not correct');
    }
};

exports.deleteCourse = async function(id){
    try{
        id=Objectid(id);
        var course=await Course.findById(id);
        if (course==null||course=='') return makeJson('Error','ID not found');
        await Course.deleteOne({_id:id},function(err){
            if (err) {
                return makeJson('Error','Error when delete');
            }
        });
        await removeCourseFromTeacher(id);
        return makeJson('Sucess','Delete successfully');
    }catch{
        return makeJson('Error','Course ID not correct');
    }
};

exports.createCourse = async function(name,code,departments,short,full,url,teachers){
    if (await existed(0,code)) {
        return makeJson('Error','Course code existed');
    }
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    var course = new Course({
        courseName: name,
        courseCode: code,
        departments: departments,
        shortDes: short,
        fullDes: full,
        courseURL : url,
        dateCreated: today,
        teachers: teachers
    });
    await course.save();
    await addCourseToTeacher(course._id,teachers);
    return makeJson('Sucess','Create successfully');
};

exports.updateCourse = async function(id,name,code,departments,short,full,url,teachers){
    if (await existed(id,code)) {
        return makeJson('Error','Course code existed');
    }
    try{
        id=Objectid(id);
        var course=await Course.find({_id:id});
        if (course==null||course=='') return makeJson('Error','ID not found');
        await Course.updateOne({_id:id},{courseName:name,courseCode:code,departments:departments,shortDes:short,fullDes:full,courseURL:url,teachers:teachers});
        await removeCourseFromTeacher(id);
        await addCourseToTeacher(id,teachers);
        return makeJson('Sucess','Update successfully');
    }catch{
        return makeJson('Error','Course ID not correct');
    }
};

exports.searchCourse = async function(page,perPage,detail){
    var result,size;
    result = await Course.find({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]}, 
    function(err, docs) {
        if (err) handleError(err);
        }).populate('teachers');
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    if (page!=0){
        result = await Course.find({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]},
                            function(err, docs) {
                                if (err) handleError(err);
                                }).populate('teachers')
                                .skip(perPage*(page-1))
                                .limit(Number(perPage));
    }
    result=JSON.stringify(result);
    result='{"totalPage":'+size+',"result":'+result+'}';
    return result;
}

exports.searchDepartments = async function(page,perPage,detail){
    var result,size;
    result = await Course.find({departments:{$regex:detail,$options:"i"}}, 
    function(err, docs) {
        if (err) handleError(err);
        }).populate('teachers');
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    if (page!=0){
        result = await Course.find({departments:{$regex:detail,$options:"i"}},
                            function(err, docs) {
                                if (err) handleError(err);
                                }).populate('teachers')
                                .skip(perPage*(page-1))
                                .limit(Number(perPage));
    }
    result=JSON.stringify(result);
    result='{"totalPage":'+size+',"result":'+result+'}';
    return result;
}