const TeacherDAO = require('../dao/TeacherDAO');

async function isEmpty(teacherName,email){
    if ([teacherName,email].includes(undefined)
            || [teacherName,email].includes(null)
                || (teacherName=="")||(email==""))
                return 1;
    return 0;
};

function msgEmpty(){
    var newObject = '{"Error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.getAllTeacher = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(await TeacherDAO.getAllTeacher());
};

exports.getTeacherByID = async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    const teacher=await TeacherDAO.getTeacherByID(id);
    res.send(teacher);
};

exports.updateTeacher = async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    var teacherName=req.body.teacherName;
    var email=req.body.email;
    // var courses=req.body.courses;
    var isActive=req.body.isActive;
    if (await isEmpty(teacherName,email))
                res.send(msgEmpty()); 
        else {
            res.send(await TeacherDAO.updateTeacher(id,teacherName,email,isActive));            
        }
};

exports.changeteacherisactive = async (req,res) => {
    res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    var isActive=req.body.isActive;
    res.send(await TeacherDAO.changeteacherisactive(id,isActive));
}

exports.searchTeacher = async(req,res) => {
    res.setHeader("Content-Type", "application/json");
    var page=req.query.page;
    var perPage=req.query.limit;
    var detail=req.query.detail;
    res.send(await TeacherDAO.searchTeacher(page,perPage,detail));
};