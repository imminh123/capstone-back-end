const TeacherDAO = require('../dao/TeacherDAO');

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

exports.updateTeacher = async (req,res,next) => {
    console.log('update teacher called');
    var id=req.params['id'];
    console.log("teacher id is "+id);
    var teacherName=req.body.teacherName;
    console.log("request return "+teacherName);
    //check if all fields are filled
    if ([teacherName].includes(undefined)
            || [teacherName].includes(null))
                res.status(200).send("All field must be filled"); 
        else {
                await TeacherDAO.updateTeacher(id,teacherName);
                res.status(200).send("Update successfully");              
        }
};