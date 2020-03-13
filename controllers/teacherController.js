const TeacherDAO = require('../dao/TeacherDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.getAllTeacher = async (req, res) => {
    // res.setHeader("Content-Type", "application/json");
    res.send(await TeacherDAO.getAllTeacher());
};

exports.getTeacherByID = async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    res.send(await TeacherDAO.getTeacherByID(id));
};

exports.updateTeacher = async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    var teacherName=req.body.teacherName;
    var email=req.body.email;
    var isActive=req.body.isActive;
    if (isEmpty(teacherName)||isEmpty(email))
                res.send(msgEmpty()); 
        else {
            res.send(await TeacherDAO.updateTeacher(id,teacherName,email,isActive));            
        }
};

exports.changeteacherisactive = async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    var isActive=req.body.isActive;
    if (isActive.toString()=='') res.send(msgEmpty());
    res.send(await TeacherDAO.changeteacherisactive(id,isActive));
}

exports.searchTeacher = async(req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var page=req.query.page;
    var perPage=req.query.limit;
    var detail=req.query.detail;
    if (isEmpty(page)||isEmpty(perPage)||isEmpty(detail)) res.send(msgEmpty());
    res.send(await TeacherDAO.searchTeacher(page,perPage,detail));
};