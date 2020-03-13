const Course = require('../models/Course');
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
    if (!(department==null||department=='')) return makeJson('error','Department name already existed');
    department = new Department({
        name: name,
        description: description,
    });
    await department.save();
    var result = {
        'success':'Create successfully',
        department
    };
    return result;
}

exports.getDepartmentByID = async function(id){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','highlightID not correct');
    }
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('error','departmentID not found');
    return department;  
}

exports.deleteDepartmentByID = async function(id){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','departmentID not correct');
    }
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('error','departmentID not found');
    
    await Department.deleteOne({_id:id},function(err){
        if (err) {
            return makeJson('error','Error when delete');
        }
    });
    return makeJson('success','Delete successfully');
}

exports.updateDepartment = async function(id,name,description){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','departmentID not correct');
    }

    var departmentByID=await Department.findById(id);
    if (departmentByID==null||departmentByID=='') return makeJson('error','departmentID not found');
    var oldName=departmentByID.name;
    if (oldName!=name){
        var allDep=await Department.find();
        for (const dep of allDep){
            if (name==dep.name) return makeJson('error','Department name already existed');
        }
        //change all courses have department old name to new name
        await Course.updateMany({departments:oldName},{$set:{'departments.$':name}});
    }

    await Department.updateOne({_id:id},{name:name,description:description});
    var result = await Department.findById(id);
    result = {
        'success':'Update successfully',
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
    if (department==null||department=='') return makeJson('error','Department name not found');
    return department;
}

exports.deleteDepartmentByName = async function(name){
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('error','Department name not found');
    await Department.deleteOne({name:name},function(err){
        if (err) {
            return makeJson('error','Error when delete');
        }
    });
    return makeJson('success','Delete successfully');
}