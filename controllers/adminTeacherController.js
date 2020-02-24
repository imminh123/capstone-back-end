const TeacherDAO = require('../dao/TeacherDAO');

async function isEmpty(teacherName,email){
    if ([teacherName,email].includes(undefined)
            || [teacherName,email].includes(null)
                || (teacherName=="")||(email==""))
                return 1;
    return 0;
};

function makeJson(msg){
    var newObject = '{"message":"'+msg+'"}';
    console.log(newObject);
    return JSON.parse(newObject);
}

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
    //if returned teacher is null
    if (teacher==null||teacher=='[]')
        res.status(404).send(makeJson("There's no teacher with id "+id));
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
                res.status(200).send(makeJson("All field must be filled")); 
        else {
                await TeacherDAO.updateTeacher(id,teacherName,email,course);
                res.status(200).send(makeJson("Update successfully"));              
        }
};

exports.searchTeacher = async(req,res) => {
    res.setHeader("Content-Type", "application/json");
    console.log('search teacher called');
    var page=req.query.page;
    var perPage=req.query.limit;
    var detail=req.query.detail;
    console.log('request return '+page+' '+perPage+' '+detail);
    res.send(await TeacherDAO.searchTeacher(page,perPage,detail));
};