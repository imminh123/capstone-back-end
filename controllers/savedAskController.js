const savedAskDAO = require('../dao/SavedAskDAO');

exports.addSavedAsk = async (req,res) => {
    var teacherID=req.params['teacherID'];
    var askID=req.params['askID'];
    res.send(await savedAskDAO.addSavedAsk(teacherID,askID));
}

exports.removeSavedAsk = async (req,res) => {
    var teacherID=req.params['teacherID'];
    var askID=req.params['askID'];
    res.send(await savedAskDAO.removeSavedAsk(teacherID,askID));
}

exports.getSavedAskByTeacherID = async (req,res) => {
    var teacherID=req.params['id'];
    res.send(await savedAskDAO.getSavedAskByTeacherID(teacherID));
}