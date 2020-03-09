const CourseDAO = require('../dao/CourseDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"Error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.getAllCourse = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(await CourseDAO.getAllCourse());
};

exports.getCourseByID = async (req,res) => {
    res.setHeader("Content-Type", "application/json");
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
    //check if all fields are filled
    if (isEmpty(courseName)||isEmpty(courseCode)||isEmpty(shortDes)||isEmpty(fullDes)||isEmpty(courseURL))
                res.send(msgEmpty()); 
        else {
            res.send(await CourseDAO.createCourse(courseName,courseCode,departments,shortDes,fullDes,courseURL,teachers));                    
        }
};

exports.updateCourse = async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    var courseName=req.body.courseName;
    var courseCode=req.body.courseCode;
    var departments=req.body.departments;
    var shortDes=req.body.shortDes;
    var fullDes=req.body.fullDes;
    var courseURL=req.body.courseURL;
    var teachers=req.body.teachers;
    //check all fields are filled
    if (isEmpty(courseName)||isEmpty(courseCode)||isEmpty(shortDes)||isEmpty(fullDes)||isEmpty(courseURL))
                res.send(msgEmpty()); 
        else {
            res.send(await CourseDAO.updateCourse(id,courseName,courseCode,departments,shortDes,fullDes,courseURL,teachers));                       
        }
};

exports.deleteCourse =async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    res.send(await CourseDAO.deleteCourse(id));
};

exports.searchCourse = async(req,res) => {
    res.setHeader("Content-Type", "application/json");
    var page=req.query.page;
    var perPage=req.query.limit;
    var detail=req.query.detail;
    res.send(await CourseDAO.searchCourse(page,perPage,detail));
};

exports.searchDepartments = async(req,res) => {
    res.setHeader("Content-Type", "application/json");
    var page=req.query.page;
    var perPage=req.query.limit;
    var detail=req.query.detail;
    if (isEmpty(page)||isEmpty(perPage)||isEmpty(detail)) res.send(msgEmpty());
    res.send(await CourseDAO.searchDepartments(page,perPage,detail));
}