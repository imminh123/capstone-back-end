const departmentDAO = require('../dao/DepartmentDAO');

exports.createDepartment = async (req, res, next) => {
    var name=req.body.name;
    res.send(await departmentDAO.createDepartment(name));               
};

exports.getDepartment = async (req,res) => {
    var id=req.params['id'];
    res.send(await departmentDAO.getDepartmentByID(id));
}

exports.allDepartment = async (req,res) => {
    res.send(await departmentDAO.getAllDepartment());
}

exports.deleteDepartment = async (req,res) => {
    var id=req.params['id'];
    res.send(await departmentDAO.deleteDepartmentByID(id));
}

exports.updateDepartment = async (req,res) => {
    var id=req.params['id'];
    var name=req.body.name;
    res.send(await departmentDAO.updateDepartment(id,name));
}

exports.getCourseOfDepartment=async(req,res)=>{
    var id=req.params['id'];
    res.send(await departmentDAO.getCourseOfDepartment(id));
}

exports.searchDepartment=async(req,res)=>{
    var text=req.query.text;
    res.send(await departmentDAO.searchDepartment(text));
}