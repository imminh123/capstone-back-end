const Department = require('../models/Department');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

async function newNameExisted(name){
    
}

exports.createDepartment = async function(name,description){
    var department = await Department.findOne({name:name});
    if (!(department==null||department=='')) return makeJson('Error','Department name already existed');
    department = new Department({
        name: name,
        description: description,
    });
    await department.save();
    var result = {
        'Success':'Create successfully',
        department
    };
    return result;
}

exports.getDepartmentByID = async function(id){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','highlightID not correct');
    }
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('Error','departmentID not found');
    return department;  
}

exports.deleteDepartmentByID = async function(id){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','departmentID not correct');
    }
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('Error','departmentID not found');
    
    await Department.deleteOne({_id:id},function(err){
        if (err) {
            return makeJson('Error','Error when delete');
        }
    });
    return makeJson('Sucess','Delete successfully');
}

exports.updateDepartment = async function(id,name,description){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','departmentID not correct');
    }

    var departmentByID=await Department.findById(id);
    if (departmentByID==null||departmentByID=='') return makeJson('Error','departmentID not found');

    if (departmentByID.name!=name){
        var allDep=await Department.find();
        for (const dep of allDep){
            if (name==dep.name) return makeJson('Error','Department name already existed');
        }
    }

    await Department.updateOne({_id:id},{name:name,description:description});
    var result = await Department.findById(id);
    result = {
        'Success':'Update successfully',
        result
    };
    return result;
}

exports.getAllDepartment = async function(){
    var result=await Department.find();
    return result;
}

exports.getDepartmentByName = async function(name){
    var department=await Department.findOne({name:name});
    if (department==null||department=='') return makeJson('Error','Department name not found');
    return department;
}

exports.deleteDepartmentByName = async function(name){
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('Error','Department name not found');
    await Department.deleteOne({name:name},function(err){
        if (err) {
            return makeJson('Error','Error when delete');
        }
    });
    return makeJson('Sucess','Delete successfully');
}