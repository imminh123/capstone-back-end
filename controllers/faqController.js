const faqDAO = require('../dao/FAQDAO');

exports.createFAQ = async (req,res) => {
    var teacherID=req.body.teacherID;
    var askID=req.body.askID;
    var scannedContent=req.body.scannedContent;
    var askContent=req.body.askContent;
    var answer=req.body.answer;
    res.send(await faqDAO.createFAQ(teacherID,askID,scannedContent,askContent,answer));
}

exports.removeFAQ = async (req,res) => {
    var id=req.params['id'];
    res.send(await faqDAO.removeFAQ(id));
}

exports.getFAQbyTeacherID = async (req,res) => {
    var teacherID=req.params['id'];
    res.send(await faqDAO.getFAQByTeacherID(teacherID));
}

exports.getFAQ = async (req,res) => {
    var id=req.params['id'];
    res.send(await faqDAO.getFAQ(id));
}