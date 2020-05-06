const CourseDAO = require('../dao/CourseDAO');

exports.getAllCourse = async (req, res) => {
    res.send(await CourseDAO.getAllCourse());
};

exports.getCourseByID = async (req,res) => {
    var id=req.params['id'];
    res.send(await CourseDAO.getCourseByID(id));
};

exports.createCourse = async (req, res) => {
    var courseName=req.body.courseName;
    var courseCode=req.body.courseCode;
    var departments=req.body.departments;
    var shortDes=req.body.shortDes;
    var fullDes=req.body.fullDes;
    var courseURL=req.body.courseURL;
    var teachers=req.body.teachers;
    res.send(await CourseDAO.createCourse(courseName,courseCode,departments,shortDes,fullDes,courseURL,teachers));
};

exports.updateCourse = async (req,res) => {
    var id=req.params['id'];
    var courseName=req.body.courseName;
    var courseCode=req.body.courseCode;
    var departments=req.body.departments;
    var shortDes=req.body.shortDes;
    var fullDes=req.body.fullDes;
    var courseURL=req.body.courseURL;
    var teachers=req.body.teachers;
    res.send(await CourseDAO.updateCourse(id,courseName,courseCode,departments,shortDes,fullDes,courseURL,teachers));                       
};

exports.deleteCourse =async (req,res) => {
    var id=req.params['id'];
    res.send(await CourseDAO.deleteCourse(id));
};

exports.searchCourse = async(req,res) => {
    var page=req.query.page;
    var perPage=req.query.limit;
    var detail=req.query.detail;
    res.send(await CourseDAO.searchCourse(page,perPage,detail));
};