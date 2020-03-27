const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
    
}

exports.createAdmin = async function(adminName,email,gender,avatar){

    var admin=await Admin.findOne({email:email});
    if (!(admin==null||admin=='')) return makeJson('error','Email already existed');

    admin = new Admin({
        name:adminName,
        email:email,
        gender:gender,
        avatar:avatar
    });
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