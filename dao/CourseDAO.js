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
    if ((courseByCode!=null && courseByCode._id!=id.toString())
       ||(courseByUrl!=null && courseByUrl._id!=id.toString())) {
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

    //delete all note highlight and folder of empty course
    // const Note = require('../models/Note');
    // const Highlight = require('../models/Highlight');
    // await Folder.deleteMany({courseID:''});
    // await Highlight.deleteMany({courseID:''});
    // await Note.deleteMany({courseID:''});

    return await Course.find({}).populate('teachers').sort({_id:-1});;

};

//return a course by id
exports.getCourseByID = async function(id){

    id=Objectid(id);
    var course = await Course.find({_id:id}).populate('teachers');
    if (course==null||course=='') return {error:'Course not found'}

    return course;

};

//delete course and remove teacher.this course
exports.deleteCourse = async function(id){

    id=Objectid(id);
    var course=await Course.findById(id);
    if (course==null||course=='') return {error:'Course not found'}

    //when delete course. unlink every folder to this course
    await Folder.updateMany({courseID:course._id},{courseID:''});
    await Ask.updateMany({courseID:course._id},{courseID:''});
    await FAQ.updateMany({courseCode:course.courseCode},{courseCode:'Other'});

    await Course.deleteOne({_id:id});

    await removeCourseFromTeacher(id);
    await removeCourseFromStudent(id);

    return {success:'Delete successfully'};

};

//create a new course
exports.createCourse = async function(name,code,departments,short,full,url,teachers){

    name=name.trim();
    code=code.trim();

    if (getFunction.isEmpty(name,code,short,full,url)) return {error:'All field must be filled'}

    if (code=='Other') return {error:'Course code cannot not be Other'}

    if (await existed(0,code,url)) {
        return {error:'New code or url already existed'};
    }
    if (await invalidDepartment(departments)) return {error:'Department not found'};

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

    return {
        'success':'Create successfully',
        course
    }

};

//update a course
exports.updateCourse = async function(id,name,code,departments,short,full,url,teachers){

    name=name.trim();
    code=code.trim();

    if (getFunction.isEmpty(name,code,short,full,url)) return {error:'All field must be filled'}

    id=Objectid(id);
    var course=await Course.findById(id);
    if (course==null||course=='') return {error:'Course not found'}

    if (code=='Other') return {error:'Course code cannot not be Other'}

    if (await existed(id,code,url)) {
        return {error:'New code or url already existed'};
    }

    if (await invalidDepartment(departments)) return {error:'Department not found'};
    
    //update all folder name and code link to this course
    if (course.courseCode!=code||course.courseName!=name) {
        await Folder.updateMany({courseID:course._id},{courseCode:code,courseName:name});
        await FAQ.updateMany({courseCode:course.courseCode},{courseCode:code});
    }

    course=await Course.findOneAndUpdate({_id:id}
        ,{courseName:name,courseCode:code,departments:departments,shortDes:short,fullDes:full,courseURL:url,teachers:teachers}
        ,{returnOriginal: false});
    
    await removeCourseFromTeacher(id);
    await addCourseToTeacher(id,teachers);

    // course=await Course.findById(id);
    return {
        'success':'Update successfully',
        course
    }

};

//seach for course
exports.searchCourse = async function(page,perPage,detail){

    if (getFunction.isEmpty(page,perPage)) return {error:'All field must be filled'}

    var result,size;
    
    result = await Course.find({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]}).populate('teachers');
    
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);

    //if all result isn't need, search for result in page
    if (page!=0){
        result = await Course.find({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]}).populate('teachers')
                                .skip(perPage*(page-1))
                                .limit(Number(perPage));
    }

    return {
        totalPage:size,
        result:result
    };

}