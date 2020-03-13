const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Department = require('../models/Department');
const getTime = require('../dao/getTime');
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

async function invalidDepartment(departments){
    var departmentlist=await Department.find();
    for (const newData of departments)
        for (const fromDB of departmentlist)
            if (newData!=fromDB.name) return 1;
    return 0;
}
  
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

//return all course
exports.getAllCourse = async function () {
    var courselist = await Course.find({}).populate('teachers');
    return courselist;
};

//return a course by id
exports.getCourseByID = async function(id){
    //check courseID
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','Course ID not correct');
    }
        var course = await Course.find({_id:id}).populate('teachers');
        if (course==null||course=='') return makeJson('Error','Course ID not found');
        return course;
    
};

//delete course and remove teacher.this course
exports.deleteCourse = async function(id){
    //check courseID
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','Course ID not correct');
    }
        var course=await Course.findById(id);
        if (course==null||course=='') return makeJson('Error','ID not found');
        await Course.deleteOne({_id:id},function(err){
            if (err) {
                return makeJson('Error','Error when delete');
            }
        });
        await removeCourseFromTeacher(id);
        return makeJson('Sucess','Delete successfully');
  
};

//create a new course
exports.createCourse = async function(name,code,departments,short,full,url,teachers){
    if (await existed(0,code)) {
        return makeJson('Error','Course code existed');
    }
    if (await invalidDepartment(departments)) return makeJson('Error','Department not found');
    var course = new Course({
        courseName: name,
        courseCode: code,
        departments: departments,
        shortDes: short,
        fullDes: full,
        courseURL : url,
        dateCreated: getTime.today(),
        teachers: teachers
    });
    await course.save();
    await addCourseToTeacher(course._id,teachers);
    return makeJson('Sucess','Create successfully');
};

//update a course
exports.updateCourse = async function(id,name,code,departments,short,full,url,teachers){
    //check courseID
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','Course ID not correct');
    }
    if (await existed(id,code)) {
        return makeJson('Error','Course code existed');
    }
    if (await invalidDepartment(departments)) return makeJson('Error','Department not found');
    var course=await Course.find({_id:id});
    if (course==null||course=='') return makeJson('Error','ID not found');
    await Course.updateOne({_id:id},{courseName:name,courseCode:code,departments:departments,shortDes:short,fullDes:full,courseURL:url,teachers:teachers});
    await removeCourseFromTeacher(id);
    await addCourseToTeacher(id,teachers);
    return makeJson('Sucess','Update successfully');
    
};

//seach for course
exports.searchCourse = async function(page,perPage,detail){
    var result,size;
    //all result. may need better solution for this
    result = await Course.find({$or:[{courseName:{$regex:detail,$options:"i"}},{courseCode:{$regex:detail,$options:"i"}}]}, 
    function(err, docs) {
        if (err) handleError(err);
        }).populate('teachers');
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    //if all result isn't need, search for result in page
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

//search for departments
exports.searchDepartments = async function(page,perPage,detail){
    var result,size;
    //all result
    result = await Course.find({departments:{$regex:detail,$options:"i"}}, 
    function(err, docs) {
        if (err) handleError(err);
        }).populate('teachers');
    if (page==0) size=1; else size=Math.ceil(result.length/perPage);
    //result in a page
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

exports.allCourseOfStudent = async function(sID){
    try{
        sID=Objectid(sID);
    }catch{
        return makeJson('Error','studentID not correct');
    }
    var student=await Student.findById(sID).populate('courses');
    if (student==null||student=='') return makeJson('Error','studentID not found');
    return student.courses;
}