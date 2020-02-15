const CourseDAO = require('../dao/CourseDAO');

exports.getAllCourse = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log('get all course called');
    res.send(await CourseDAO.getAllCourse());
};

exports.getCourseByID = async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    console.log('get course by id '+id);
    const course=await CourseDAO.getCourseByID(id);
    console.log(Object.keys(course).length);
    //means DAO return a null course or course = [] which means nothing
    if (Object.keys(course).length==2||course==null)
        res.status(404).send("There's no course with id "+id);
    else
        res.send(course);
};

exports.createCourse = async (req, res, next) => {
    console.log('create course called');
    var courseName=req.body.courseName;
    var courseCode=req.body.courseCode;
    var category=req.body.category;
    var shortDes=req.body.shortDes;
    var fullDes=req.body.fullDes;
    var courseURL=req.body.courseURL;
    var teacherID=req.body.teacherID;
    console.log("request return "+courseName+" "+courseCode+" "+category+" "+shortDes+" "+fullDes+" "+courseURL+" "+teacherID);
    //check if all fields are filled
    if ([courseName,courseCode,category,shortDes,fullDes,courseURL,teacherID].includes(undefined)
            || [courseName,courseCode,category,shortDes,fullDes,courseURL,teacherID].includes(null))
                res.status(200).send("All field must be filled"); 
        else {
            //if new code existed in database
            if (await CourseDAO.createCourse(courseName,courseCode,category,shortDes,fullDes,courseURL,teacherID)==0)
            res.status(200).send("There's already an course with the same code");
            else
                res.status(201).send("Course created");                    
        }
};

exports.updateCourse = async (req,res,next) => {
    console.log('update course called');
    var id=req.params['id'];
    console.log("current id is "+id);
    var courseName=req.body.courseName;
    var courseCode=req.body.courseCode;
    var category=req.body.category;
    var shortDes=req.body.shortDes;
    var fullDes=req.body.fullDes;
    var courseURL=req.body.courseURL;
    var teacherid=req.body.teacherID;
    console.log("request return "+courseName+" "+courseCode+" "+category+" "+shortDes+" "+fullDes+" "+courseURL+" "+teacherid);
    //check all fields are filled
    if ([courseName,courseCode,category,shortDes,fullDes,courseURL,teacherid].includes(undefined)
            || [courseName,courseCode,category,shortDes,fullDes,courseURL,teacherid].includes(null))
                res.status(200).send("All field must be filled"); 
        else {
            //if new code existed in database
            if (await CourseDAO.updateCourse(id,courseName,courseCode,category,shortDes,fullDes,courseURL,teacherid)==0) res.status(200).send("New course code already existed");
            else
                res.status(200).send("Update successfully");              
        }
};

exports.deleteCourse =async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    console.log('delete course called');
    var id=req.params['id'];
    console.log('delete course by id '+id);
    var check=await CourseDAO.deleteCourse(id);
    res.status(200).send('Delete course with id '+id+' successfully');
};

