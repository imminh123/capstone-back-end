const CourseDAO = require('../dao/CourseDAO');

exports.getAllCourse = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log('get all course called');
    res.send(await CourseDAO.getAllCourse());
};

exports.getCourseByCode = async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    var code=req.params['courseCode'];
    console.log('get course by code '+code);
    const course=await CourseDAO.getCourseByCode(code)
    console.log(Object.keys(course).length);
    if (Object.keys(course).length==2)
        res.status(404).send("There's no course with code "+code);
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
    var skill=req.body.skill;
    console.log("request return "+courseName+" "+courseCode+" "+category+" "+shortDes+" "+fullDes+" "+skill);
    if ([courseName,courseCode,category,shortDes,fullDes,skill].includes(undefined)
            || [courseName,courseCode,category,shortDes,fullDes,skill].includes(null))
                res.status(200).send("All field must be filled"); 
        else {
            if (await CourseDAO.createCourse(courseName,courseCode,category,shortDes,fullDes,skill)==0)
            res.status(200).send("There's already an course with the same code");
            else
                res.status(201).send("Course created");                    
        }
};

exports.updateCourse = async (req,res,next) => {
    console.log('update course called');
    var currentCode=req.params['currentCode'];
    console.log("current code is "+currentCode);
    var courseName=req.body.courseName;
    var courseCode=req.body.courseCode;
    var category=req.body.category;
    var shortDes=req.body.shortDes;
    var fullDes=req.body.fullDes;
    var skill=req.body.skill;
    console.log("request return "+courseName+" "+courseCode+" "+category+" "+shortDes+" "+fullDes+" "+skill);
    if ([courseName,courseCode,category,shortDes,fullDes,skill].includes(undefined)
            || [courseName,courseCode,category,shortDes,fullDes,skill].includes(null))
                res.status(200).send("All field must be filled"); 
        else {
            var check =await CourseDAO.updateCourse(currentCode,courseName,courseCode,category,shortDes,fullDes,skill);
            if (check==0) res.status(200).send("Current code not found");
            else
            if (check==1) res.status(200).send("New code already existed");
            else
                res.status(200).send("Update successfully");              
        }
};

exports.deleteCourse =async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    console.log('delete course called');
    var code=req.params['courseCode'];
    console.log('delete course by code '+code);
    var check=await CourseDAO.deleteCourse(code);
    if (check==0)
        res.status(404).send("There's no course with code "+code);
    else
        res.status(200).send('Delete course with code '+code+' successfully');
};

