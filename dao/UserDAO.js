const User = require('../models/User');
const TempUser = require('../models/TempUser');
var Objectid = require('mongodb').ObjectID;
const TeacherDAO = require('../dao/TeacherDAO');
const StudentDAO = require('../dao/StudentDAO');
var bcrypt = require('bcrypt');

const saltRounds = 10;

exports.createUser = async function(email,google,tokens,role,profile,password){
    var user = await User.findOne({email:email});
    var newProfile = null;
    var error,status;
    
    if (!(user==null||user=='')) return {error:'User Email already existed'};

    var newProfile=new TempUser({
        name:profile.name,
        email:email,
        gender:profile.gender,
        avatar:profile.avatar
    });

    await newProfile.save();

    const newUser = new User({
        email:email,
        name: profile.name,
        password: password,
        google:google,
        tokens:tokens,
        role:role,
        avatar: profile.avatar,
        gender: profile.gender,
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
            status = 'error'

        return { status, user, error }
    });
}

exports.getUserByID = async function(id){

    id=Objectid(id);
    var user=await User.findById(id).populate('profile');
    if (user==null||user=='') return {error:'User not found'};

    return user;

}

exports.chooseRole= async function(email,role) {

    var user = await User.findOne({email:email});
    if (user==null||user=='') return {error:'Email not found'}

    if (role=='teacher') {
        newProfile = await TeacherDAO.createTeacher(user.name,email,user.gender,user.avatar);
    }
    else if (role=='student') {
        newProfile = await StudentDAO.createStudent(user.name,email,user.gender,user.avatar);
    }
    else
        return {error:'Role not correct [teacher,student]'};

    if (newProfile.error) return {error:newProfile.error};

    await TempUser.deleteOne({email:email});

    return await User.findOneAndUpdate({email:email},{profile:newProfile._id,role:role},{returnOriginal: false});

}

exports.getAllUser = async function(id){

    return await User.find();

}

exports.deleteUser = async function(id){

    id=Objectid(id);
    
    await User.deleteOne({_id:id});

    return {success:'Delete successfully'};

}