var Objectid = require('mongodb').ObjectID;
const Ask = require('../models/Ask');
const FAQ = require('../models/FAQ');
const Course = require('../models/Course');
const Folder = require('../models/Folder');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Department = require('../models/Department');
const getFunction = require('./getFunction');

//check if code has already existed
async function existed(id,code,url){

    var existed=0;

    var courseByCode=await Course.findOne({courseCode:code});
    var courseByUrl=await Course.findOne({courseURL:url});

    //if no course was found. Or a course was found but code is unchanged
    if ((courseByCode!=null && courseByCode._id!=id)
       ||(courseByUrl!=null && courseByUrl._id!=id)) {
        existed=1;
    }

    return existed;

};

async function invalidDepartment(departments){

    var departmentlist=await Department.find();
    var existed;

    for (const newData of departments){
        existed=0;
        for (const fromDB of departmentlist){
            if (newData==fromDB.name){
                existed=1;
                break;
            }
        }
        if (existed==0) return 1;
    }
    return 0;

}
  
//remove this course from every teacher
async function removeCourseFromTeacher(id){

    await Teacher.updateMany(
        {},
        {$pull: {courses:id}},
        {safe: true}
    );

};

//remove this course from every teacher
async function removeCourseFromStudent(id){

    await Student.updateMany(
        {},
        {$pull: {courses:id}},
        {safe: true}
    );

};

//add this course to new teacher
async function addCourseToTeacher(courseid,teachers){

    teachers.forEach(async function (data) {
            var teacherid = Objectid(data);
            await Teacher.updateOne({ _id: teacherid }, { $addToSet: { courses: courseid } }
                        , { safe: true });
        });

};

//return all course
exports.getAllCourse = async function () {

    return await Course.find({}).populate('teachers').sort({_id:-1});;

};

//return a course by id
exports.getCourseByID = async function(id){

    id=Objectid(id);
    var course = await Course.find({_id:id}).populate('teachers');
    if (course==null||course=='') return getFunction.makeJson('error','Course ID not found');

    return course;

};

//delete course and remove teacher.this course
exports.deleteCourse = async function(id){

    id=Objectid(id);
    var course=await Course.findById(id);
    if (course==null||course=='') return getFunction.makeJson('error','ID not found');

    //when delete course. unlink every folder to this course
    await Folder.updateMany({courseID:course._id},{courseID:''});
    await Ask.updateMany({courseID:course._id},{courseID:''});
    await FAQ.updateMany({courseCode:'Other'});

    await Course.deleteOne({_id:id});

    await removeCourseFromTeacher(id);
    await removeCourseFromStudent(id);

    return getFunction.makeJson('success','Delete successfully');

};

//create a new course
exports.createCourse = async function(name,code,departments,short,full,url,teachers){

    if (await existed(0,code,url)) {
        return getFunction.makeJson('error','New code or url already existed');
    }
    if (await invalidDepartment(departments)) return getFunction.makeJson('error','Department not found');

    var course = new Course({
        courseName: name,
        courseCode: code,
        departments: departments,
        shortDes: short,
        fullDes: full,
        courseURL : url,
        dateCreated: getFunction.today(),
        teachers: teachers
    });
    await course.save();

    await addCourseToTeacher(course._id,teachers);
    var result = {
        'success':'Create successfully',
        course
    }

    return result;

};

//update a course
exports.updateCourse = async function(id,name,code,departments,short,full,url,teachers){

    if (await existed(id,code,url)) {
        return getFunction.makeJson('error','New code or url already existed');
    }

    if (await invalidDepartment(departments)) return getFunction.makeJson('error','Department not found');
    id=Objectid(id);
    var course=await Course.findById(id);

    //update all folder name and code link to this course
    if (course.courseCode!=code||course.courseName!=name) {
        await Folder.updateMany({courseID:course._id},{courseCode:code,courseName:name});
        await FAQ.updateMany({courseCode:course.courseCode},{courseCode:code});
    }
        
    if (course==null||course=='') return getFunction.makeJson('error','ID not found');

    await Course.findOneAndUpdate({_id:id}
        ,{courseName:name,courseCode:code,departments:departments,shortDes:short,fullDes:full,courseURL:url,teachers:teachers}
        ,{returnOriginal: false}
        ,function(err,doc){
            if (err) return err;
            course=doc;
        });
    
    await removeCourseFromTeacher(id);
    await addCourseToTeacher(id,teachers);

    // course=await Course.findById(id);
    var result = {
        'success':'Update successfully',
        course
    }

    return result;

};

//seach for course
exports.searchCourse = async function(page,perPage,detail){

    var result,size;
    
    result = await Course.find({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]}).populate('teachers');
    
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);

    //if all result isn't need, search for result in page
    if (page!=0){
        result = await Course.find({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]}).populate('teachers')
                                .skip(perPage*(page-1))
                                .limit(Number(perPage));
    }

    result=JSON.stringify(result);
    result='{"totalPage":'+size+',"result":'+result+'}';

    return result;

}