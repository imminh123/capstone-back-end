const CourseDAO = require('../dao/CourseDAO');

async function isEmpty(courseName,courseCode,shortDes,fullDes,courseURL){
    if ([courseName,courseCode,shortDes,fullDes,courseURL].includes(undefined)
        || [courseName,courseCode,shortDes,fullDes,courseURL].includes(null)
            || (courseName=="") || (courseCode=="")
            || (shortDes=="") || (fullDes=="") || (courseURL==""))
                return 1;
    return 0;
}

function makeJson(msg){
    var newObject = '{"message":"'+msg+'"}';
    console.log(newObject);
    return JSON.parse(newObject);
}

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
    if (course==null||course=='[]')
        res.status(404).send(makeJson("There is no course with id "+id));
    else
        res.send(course);
};

exports.createCourse = async (req, res) => {
    console.log('create course called');
    var courseName=req.body.courseName;
    var courseCode=req.body.courseCode;
    var departments=req.body.departments;
    var shortDes=req.body.shortDes;
    var fullDes=req.body.fullDes;
    var courseURL=req.body.courseURL;
    var teachers=req.body.teachers;
    console.log("request return "+courseName+" "+courseCode+" "+departments+" "+shortDes+" "+fullDes+" "+courseURL+" "+teachers);
    //check if all fields are filled
    if (await isEmpty(courseName,courseCode,shortDes,fullDes,courseURL))
                res.status(200).send(makeJson("All field must be filled")); 
        else {
            //if new code existed in database
            if (await CourseDAO.createCourse(courseName,courseCode,departments,shortDes,fullDes,courseURL,teachers)==0)
            res.status(200).send(makeJson("There's already an course with the same code"));
            else
                res.status(201).send(makeJson("Course created"));                    
        }
};

exports.updateCourse = async (req,res) => {
    console.log('update course called');
    var id=req.params['id'];
    console.log("current id is "+id);
    var courseName=req.body.courseName;
    var courseCode=req.body.courseCode;
    var departments=req.body.departments;
    var shortDes=req.body.shortDes;
    var fullDes=req.body.fullDes;
    var courseURL=req.body.courseURL;
    var teachers=req.body.teachers;
    console.log(teachers);
    console.log("request return "+courseName+" "+courseCode+" "+departments+" "+shortDes+" "+fullDes+" "+courseURL+" "+teachers);
    //check all fields are filled
    if (await isEmpty(courseName,courseCode,departments,shortDes,fullDes,courseURL))
                res.status(200).send(makeJson("All field must be filled")); 
        else {
            //if new code existed in database
            if (await CourseDAO.updateCourse(id,courseName,courseCode,departments,shortDes,fullDes,courseURL,teachers)==0) res.status(200).send("New course code already existed");
            else
                res.status(200).send(makeJson("Update successfully"));              
        }
};

exports.deleteCourse =async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    console.log('delete course called');
    var id=req.params['id'];
    console.log('delete course by id '+id);
    var check=await CourseDAO.deleteCourse(id);
    if (check==0) res.status(404).send(makeJson('No course with that id '+id));
    else
        res.status(200).send(makeJson('Delete course with id '+id+' successfully'));
};

exports.searchCourse = async(req,res) => {
    res.setHeader("Content-Type", "application/json");
    console.log('search course called');
    var page=req.query.page;
    var perPage=req.query.limit;
    var detail=req.query.detail;
    console.log('request return '+page+' '+perPage+' '+detail);
    res.send(await CourseDAO.searchCourse(page,perPage,detail));
};