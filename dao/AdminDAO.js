var Objectid = require('mongodb').ObjectID;
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.createAdmin = async function(adminName,email,gender,avatar){
    var admin=await Admin.findOne({email:email});
    if (!(admin==null||admin=='')) return makeJson('Error','Email already existed');
    admin = new Admin({
        adminName:adminName,
        email:email,
        gender:gender,
        avatar:avatar
    });
    console.log('new admin '+admin);
    await admin.save();
    return admin;
}

//get number of teacher, course, and active teacher
exports.getAllNumber = async function () {
    var newObject = '{"numOfTeacher":'+await Teacher.count({})
                        +',"numOfCourse":'+await Course.count({})
                        +',"numOfActiveTeacher":'+await Teacher.count({isActive:true})+'}';
    return JSON.parse(newObject);
};