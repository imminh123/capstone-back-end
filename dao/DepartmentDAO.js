const Course = require('../models/Course');
const Department = require('../models/Department');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
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
        return makeJson('error','departmentID not correct');
    }
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('error','departmentID not found');
    var result = {
        numberOfCourse:(await Course.find({departments:department.name})).length,
        department
    }
    return result;
}

exports.deleteDepartmentByID = async function(id){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','departmentID not correct');
    }
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('error','departmentID not found');
    
    await Department.deleteOne({_id:id});
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
    var departments=await Department.find().sort({_id:-1});
    var result=[],course,newOb;
    for (department of departments){
        course = await Course.find({departments:department.name}).select('courseName courseCode');
        newOb = {
            _id:department._id,
            name:department.name,
            description:department.description,
            courses:course
        }
        result.push(newOb);
    }
    return result;
}

exports.getCourseOfDepartment = async function(id){
    try {
        id=Objectid(id);
    }
    catch{
        return makeJson('error','departmentID not correct');
    }
    var department=await Department.findById(id);
    if (department==null||department=='') return makeJson('error','departmentID not found');
    return await Course.find({departments:department.name});
}