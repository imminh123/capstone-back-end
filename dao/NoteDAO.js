const mongoose = require('mongoose');
const Folder = require('../models/Folder');
const Note = require('../models/Note');
var Objectid = require('mongodb').ObjectID;

function makeJson(msg){
    var newObject = '{"message":"'+msg+'"}';
    return JSON.parse(newObject);
}

exports.insertNote = async function(){
    
}