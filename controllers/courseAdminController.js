const CourseDAO = require('../dao/CourseDAO');

exports.getAllCourse = async (req, res) => {
    console.log('get all course called');
    res.send(await CourseDAO.getAllCourse());
};

exports.getCourseByCode = async (req,res) => {
    var code=req.params['courseCode'];
    console.log('get course by code '+code);
    const course=await CourseDAO.getCourseByCode(code)
    console.log(Object.keys(course).length);
    if (Object.keys(course).length==2)
        res.status(404).send("There's no course with code "+code);
    else
        res.send(course);
};

exports.createCourse = (req, res, next) => {
    console.log('create course called');
    res.send("Hello");
};

exports.updateCourse = (req,res,next) => {
    console.log('update course called');
    res.send("Hello");
};

exports.deleteCourse =async (req,res) => {
    console.log('delete course called');
    var code=req.params['courseCode'];
    console.log('delete course by code '+code);
    var check=await CourseDAO.deleteCourse(code);
    if (check==0)
        res.status(404).send("There's no course with code "+code);
    else
        res.status(200).send('Delete course with code '+code+' successfully');
};

