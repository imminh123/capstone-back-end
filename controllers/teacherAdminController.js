const TeacherDAO = require('../dao/TeacherDAO');

async function isEmpty(teacherName,email){
    if ([teacherName,email].includes(undefined)
            || [teacherName,email].includes(null)
                || (teacherName=="")||(email==""))
                return 1;
    return 0;
};

exports.getAllTeacher = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log('get all teacher called');
    res.send(await TeacherDAO.getAllTeacher());
};

exports.getTeacherByID = async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    console.log('get teacher by id '+id);
    const teacher=await TeacherDAO.getTeacherByID(id);
    console.log(Object.keys(teacher).length);
    //if returned teacher is null or teacher==[] means nothing
    if (Object.keys(teacher).length==2||teacher==null)
        res.status(404).send("There's no teacher with id "+id);
    else
        res.send(teacher);
};

exports.updateTeacher = async (req,res) => {
    console.log('update teacher called');
    var id=req.params['id'];
    console.log("teacher id is "+id);
    var teacherName=req.body.teacherName;
    var email=req.body.email;
    var course=req.body.course;
    console.log("request return "+teacherName+" "+email+" "+course);
    //check if all fields are filled
    if (await isEmpty(teacherName,email))
                res.status(200).send("All field must be filled"); 
        else {
                await TeacherDAO.updateTeacher(id,teacherName,email,course);
                res.status(200).send("Update successfully");              
        }
};

exports.searchTeacher = async(req,res) => {
    res.setHeader("Content-Type", "application/json");
    console.log('search teacher called');
    var page=req.query.page;
    var detail=req.query.detail;
    console.log('request return '+page+' '+detail);
    res.send(await TeacherDAO.searchTeacher(page,detail));
};