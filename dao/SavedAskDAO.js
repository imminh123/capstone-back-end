var Objectid = require('mongodb').ObjectID;
const Teacher = require('../models/Teacher');
const SavedAsk = require('../models/SavedAsk');

function makeJson(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);

}

exports.addSavedAsk = async function (teacherID,askID) {

    await SavedAsk.updateOne(
                    {teacherID:teacherID},
                    {$addToSet:{askID:askID}},
                    {safe:true,upsert:true});

    return makeJson('success','Added to folder frequently asked question');

}

exports.removeSavedAsk = async function (teacherID,askID) {

    await SavedAsk.updateOne(
        {teacherID:teacherID},
        {$pull: {askID:askID}},
        {safe: true, upsert: true}
    );

    return makeJson('success','Remove from folder frequently asked question');

}

exports.getSavedAskByTeacherID = async function(teacherID){

    var teacher = await Teacher.findById(Objectid(teacherID));
    if (teacher==null||teacher=='') return makeJson('error','teacherID not found');

    return await SavedAsk.findOne({teacherID:teacherID});

}