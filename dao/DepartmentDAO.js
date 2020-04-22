var Objectid = require('mongodb').ObjectID;
const Course = require('../models/Course');
const Department = require('../models/Department');
const getFunction = require('./getFunction');

exports.createDepartment = async function(name,description){

    var department = await Department.findOne({name:name});
    if (!(department==null||department=='')) return getFunction.makeJson('error','Department name already existed');

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

    id=Objectid(id);
    var department=await Department.findById(id);
    if (department==null||department=='') return getFunction.makeJson('error','departmentID not found');

    var result = {
        numberOfCourse:(await Course.find({departments:department.name})).length,
        department
    }

    return result;

}

exports.deleteDepartmentByID = async function(id){

    id=Objectid(id);
    var department=await Department.findById(id);
    if (department==null||department=='') return getFunction.makeJson('error','departmentID not found');

    await Course.updateMany(
        {},
        {$pull: {departments:department.name}},
        {safe: true}
    );
    await Department.deleteOne({_id:id});

    return getFunction.makeJson('success','Delete successfully');
}

exports.updateDepartment = async function(id,name,description){

    id=Objectid(id);
    var departmentByID=await Department.findById(id);
    if (departmentByID==null||departmentByID=='') return getFunction.makeJson('error','departmentID not found');

    var oldName=departmentByID.name;
    if (oldName!=name){
        var allDep=await Department.find();
        for (const dep of allDep){
            if (name==dep.name) return getFunction.makeJson('error','Department name already existed');
        }
        //change all courses have department old name to new name
        await Course.updateMany({departments:oldName},{$set:{'departments.$':name}});
    }
    
    await Department.findOneAndUpdate({_id:id},{name:name,description:description}
        ,{returnOriginal: false}
        ,function(err,doc){
            if (err) return err;
            departmentByID=doc;
        });

    result = {
        'success':'Update successfully',
        departmentByID
    };

    return result;

}

exports.getCourseOfDepartment = async function(id){

    id=Objectid(id);
    var department=await Department.findById(id);
    if (department==null||department=='') return getFunction.makeJson('error','departmentID not found');

    return await Course.find({departments:department.name});

}

departmentDetail = async function(departments){

    var result=[],course;
    for (department of departments){
        course = await Course.find({departments:department.name}).populate('teachers');
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

exports.getAllDepartment = async function(){

    var departments=await Department.find().sort({_id:-1});
    
    return await departmentDetail(departments);

}

exports.searchDepartment = async function(text){

    var departments = await Department.find({$or:[{name:{$regex:text,$options:"i"}}
    ,{description:{$regex:text,$options:"i"}}]});

    return await departmentDetail(departments);

}