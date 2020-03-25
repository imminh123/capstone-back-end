const departmentDAO = require('../dao/DepartmentDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createDepartment = async (req, res, next) => {
    var name=req.body.name;
    var description=req.body.description;
    //check if all fields are filled
    if (isEmpty(name)||isEmpty(description))
                res.send(msgEmpty());
    res.send(await departmentDAO.createDepartment(name,description));               
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
    var description=req.body.description;
    if (isEmpty(name)||isEmpty(description));
    res.send(await departmentDAO.updateDepartment(id,name,description));
}

exports.getCourseOfDepartment=async(req,res)=>{
    var id=req.params['id'];
    res.send(await departmentDAO.getCourseOfDepartment(id));
}