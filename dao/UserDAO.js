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
    var user = await User.findOne({email:email});
    var newProfile = null;
    var error,status;
    
    if (!(user==null||user=='')) return makeJson('Error','User Email already existed');

    if (role=='admin') {
        newProfile = await AdminDAO.createAdmin(profile.name,email,profile.gender,profile.avatar);
    }
    else if (role=='teacher') {
        newProfile = await TeacherDAO.createTeacher(profile.name,email,profile.gender,profile.avatar);
    }
    else if (role=='student') {
        newProfile = await StudentDAO.createStudent(profile.name,email,profile.gender,profile.avatar);

    }
    else
        return makeJson('Error','Role not correct [admin,teacher,student]');
        

    if (newProfile.error) return makeJson('error',newProfile.error);

    const newUser = new User({
        email:email,
        google:google,
        tokens:tokens,
        role:role,
        profile: {...profile, ...newProfile}
    });

    await newUser.save(function(err, user) {
        if(err) {
            console.log(err);
            error = 'Save failed'
        }

        if(user) 
            status = 'success'
        else 
            status = 'fail'

        return { status, user, error }
    });
}

exports.getUserByID = async function(id){
    try{
        id=Objectid(id);
    }catch{
        return makeJson('error','userID not correct');
    }
    var user=await User.findById(id).populate('profile');
    if (user==null||user=='') return makeJson('error','userID not found');
    return user;
}