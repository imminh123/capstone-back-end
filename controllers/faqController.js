const faqDAO = require('../dao/FAQDAO');

exports.createFAQ = async (req,res) => {
    var askID=req.body.askID;
    var answer=req.body.answer;
    res.send(await faqDAO.createFAQ(askID,answer));
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

exports.getAllFAQ = async (req,res) => {
    res.send(await faqDAO.getAllFAQ());
}

exports.getFaqByCourse = async (req,res) => {
    var course=req.params['course'];
    res.send(await faqDAO.getFAQByCourse(course));
}

exports.getFAQByNumber = async (req,res) => {
    var number=req.params['number'];
    res.send(await faqDAO.getFAQByNumber(number));
}