const User = require('../models/User');
const AdminDAO = require('../dao/AdminDAO');
const TeacherDAO = require('../dao/TeacherDAO');
const StudentDAO = require('../dao/StudentDAO');
const getTime = require('../dao/getTime');
var Objectid = require('mongodb').ObjectID;

function makeJson(type,msg){
    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.createUser = async function(email,google,tokens,role,profile){
    var user=await User.findOne({email:email});
    console.log('find user '+user);
    if (!(user==null||user=='')) return makeJson('Error','User Email already existed');

    if (role=='admin') {
        profile = await AdminDAO.createAdmin(profile.name,email,profile.gender,profile.avatar);
    }
    else if (role=='teacher') {
        profile = await TeacherDAO.createTeacher(profile.name,email,profile.gender,profile.avatar);
    }
    else if (role=='student') {
        profile = await StudentDAO.createStudent(profile.name,email,profile.gender,profile.avatar);
    }
    else
        return makeJson('Error','Role not correct [admin,teacher,student]');
    console.log('new profile '+profile);
    if (profile=='') return makeJson('Error','Profile Email already existed');
    user = new User({
        email:email,
        google:google,
        tokens:tokens,
        role:role,
        profile:profile
    });
    await user.save();
    console.log('final user '+user);
    result={
        'Success':'Create successfully',
        user
    };
    return result;
}

exports.getUserByID = async function(id){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('Error','userID not correct');
    }
    var user=await User.findById(id).populate('profile');
    if (user==null||user=='') return makeJson('Error','userID not found');
    return user;
}