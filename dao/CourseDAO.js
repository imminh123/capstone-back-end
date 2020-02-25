const mongoose = require('mongoose');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
var Objectid = require('mongodb').ObjectID;

//check if code has already existed
async function existed(id,code){
    const course=await Course.findOne({courseCode:code},function (err){
        if (err) {
            // console.log(err);
            return 0;
        }
    });
    // console.log("Course found: "+course);
    //if no course was found. Or a course was found but code is unchanged
    if (course==null || course._id==id) {
        console.log("course return null");
        return 0;
    }
    return 1;
};

async function removeCourseFromTeacher(id){
    //remove this course from every teacher
    // console.log("start removing course");
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

async function addCourseToTeacher(courseid,teachers){
    //add this course to new teacher
    // console.log("start adding course");
    teachers.forEach(async function (data) {
            var teacherid = Objectid(data);
            // console.log(teacherid);
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

//return all courses list
exports.getAllCourse = async function () {
    var courselist = await Course.find({}).populate('teachers');
    // console.log(courselist);
    return courselist;
};

//return course by id
exports.getCourseByID = async function(id){
    try{
        id=Objectid(id);
        var course = await Course.find({_id:id}).populate('teachers');
        // console.log(course);
        return course;
    }catch{
        return null;
    }
};

//delete course by id
exports.deleteCourse = async function(id){
    try{
        id=Objectid(id);
        var course=await Course.findById(id);
        if (course==null) return 0;
        await Course.deleteOne({_id:id},function(err){
            if (err) {
                // console.log(err);
                return 0;
            }
        });
        await removeCourseFromTeacher(id);
        return 1;
    }catch{
        return 0;
    }
};

//create course
exports.createCourse = async function(name,code,departments,short,full,url,teachers){
    if (await existed(0,code)) {
        // console.log("create course return 0 mean course code already existed");
        return 0;
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
        // console.log("new course is: "+course);
        await course.save();
        //create successfully
        await addCourseToTeacher(course._id,teachers);
        return 1;
};

//update course
exports.updateCourse = async function(id,name,code,departments,short,full,url,teachers){
    if (await existed(id,code)) {
        // console.log("new course code existed");
        return -1;
    }
    try{
        id=Objectid(id);
        await Course.updateOne({_id:id},{courseName:name,courseCode:code,departments:departments,shortDes:short,fullDes:full,courseURL:url,teachers:teachers});
        //update successfully
        await removeCourseFromTeacher(id);
        await addCourseToTeacher(id,teachers);
        return 1;
    }catch{
        return 0;
    }
};

exports.searchCourse = async function(page,perPage,detail){
    var result,size;
    result = await Course.aggregate()
                .match({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]})
                .project({
                    courseName: 1,
                    courseCode: 1,
                    departments: 1,
                    teachers: {$size:"$teachers"}
                })
    // console.log(result);
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    if (page!=0){
        result = await Course.aggregate()
                .match({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]})
                .project({
                    courseName: 1,
                    courseCode: 1,
                    departments: 1,
                    teachers: {$size:"$teachers"}
                })
                .skip(perPage*(page-1))
                .limit(Number(perPage));        
    }
    // console.log(result);
    result=JSON.stringify(result);
    result='{"totalPage":'+size+',"result":'+result+'}';
    return result;
}