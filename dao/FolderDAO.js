var Objectid = require('mongodb').ObjectID;
const Note = require('../models/Note');
const Course = require('../models/Course');
const Folder = require('../models/Folder');
const Student = require('../models/Student');
const Highlight = require('../models/Highlight');
const getFunction = require('./getFunction');

exports.getAllFolder = async function(){

    return await Folder.find();

}

exports.getFolderByStudentID = async function(studentID){

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};

    var folders = await Folder.find({studentID:studentID}).lean();
    var result=[];
    
    //return result with folder status of course is being studied or not
    for (folder of folders){
        folder.isStudying=false;

        if (folder.courseID!='')
            {if (student.courses.includes(folder.courseID))
                folder.isStudying=true;}

        result.push(folder);

    }

    return result;

}

exports.getHighlightByFolderID = async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return {error:'Folder not found'};

    return await Highlight.find({folderID:folderID}).sort({_id:-1});

}

exports.deleteHighlightByFolderID= async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return {error:'Folder not found'};

    await Highlight.deleteMany({folderID:folderID});

    return {success:'Delete successfully'};

}


exports.getNoteByFolderID = async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return {error:'Folder not found'};

    return await Note.find({folderID:folderID}).sort({_id:-1});

}

exports.deleteNoteByFolderID= async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return {error:'Folder not found'};

    await Note.deleteMany({folderID:folderID});

    return {success:'Delete successfully'};

}

exports.createFolder=async function(studentID,courseCode,courseName){

    courseCode=courseCode.trim();
    courseName=courseName.trim();

    if (getFunction.isEmpty(studentID)) return {error:'All field must be filled'}

    studentID=Objectid(studentID);
    var student=await Student.findById(studentID);
    if (student==null||student=='') return {error:'Student not found'};

    //check if folder existed
    var existedFolder=await Folder.findOne({studentID:studentID,courseCode:courseCode,courseName:courseName});
    if (existedFolder!=null && existedFolder!='') return {error:'Folder already existed'}

    var folder=new Folder({
        studentID:studentID,
        courseID:'',
        courseCode:courseCode,
        courseName:courseName
    });
    await folder.save();

    return {
        success:'Create successfully',
        folder
    }

}

exports.deleteFolder=async function(folderID){

    folderID=Objectid(folderID);
    var folder = await Folder.findById(folderID);
    if (folder==null||folder=='') return {error:'Folder not found'};
    
    await Highlight.deleteMany({folderID:folderID});
    await Note.deleteMany({folderID:folderID});
    
    if (folder.courseID!=''){
        var student=await Student.findById(folder.studentID);
        if (!student.courses.includes(folder.courseID)) 
            await Folder.deleteOne({_id:folderID});
    }
    else await Folder.deleteOne({_id:folderID});
    
    return {success:'Delete successfully'};
    
}

exports.getFolderByURL=async function(studentID,url){

    if (getFunction.isEmpty(studentID,url)) return {error:'All field must be filled'}

    var student=await Student.findById(Objectid(studentID));
    if (student==null||student=='') return {error:'Student not found'};

    var courses = await Course.find().populate('teachers').lean();
    var courseOfURL;
    for (course of courses){
        if (url.includes(course.courseURL)) {
            courseOfURL=course;
            break;
        }
    }
    if (courseOfURL==undefined) return {error:'Course not found'}

    if (student.courses.includes(courseOfURL._id)) courseOfURL.isStudying=true;
    else courseOfURL.isStudying=false;

    return courseOfURL;
    
}
