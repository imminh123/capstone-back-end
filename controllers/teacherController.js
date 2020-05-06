const TeacherDAO = require('../dao/TeacherDAO');

exports.getAllTeacher = async (req, res) => {
    res.send(await TeacherDAO.getAllTeacher());
};

exports.getTeacherDashboard = async (req, res) => {
    var id=req.params['id'];
    res.send(await TeacherDAO.getTeacherDashboard(id));
};

exports.getTeacherByID = async (req,res) => {
    var id=req.params['id'];
    res.send(await TeacherDAO.getTeacherByID(id));
};

exports.updateTeacher = async (req,res) => {
    var id=req.params['id'];
    var name=req.body.name;
    var email=req.body.email;
    var isActive=req.body.isActive;
    res.send(await TeacherDAO.updateTeacher(id,name,email,isActive));            
};

exports.changeteacherisactive = async (req,res) => {
    var id=req.params['id'];
    var isActive=req.body.isActive;
    res.send(await TeacherDAO.changeteacherisactive(id,isActive));
}

exports.searchTeacher = async(req,res) => {
    var page=req.query.page;
    var perPage=req.query.limit;
    var detail=req.query.detail;
    res.send(await TeacherDAO.searchTeacher(page,perPage,detail));
};

exports.allTeacherByCourse = async(req,res)=>{
    var courseID=req.params['id'];
    res.send(await TeacherDAO.allTeacherByCourse(courseID));
}