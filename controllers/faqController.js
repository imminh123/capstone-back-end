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

exports.getFAQByFilter = async (req,res) => {
    var teacherID=req.query.teacherID;
    var courseCode=req.query.courseCode;
    var page=req.query.page;
    res.send(await faqDAO.getFAQByFilter(teacherID,courseCode,page));
}

exports.getFAQ = async (req,res) => {
    var id=req.params['id'];
    res.send(await faqDAO.getFAQ(id));
}

exports.getAllFAQ = async (req,res) => {
    var page=req.query.page;
    res.send(await faqDAO.getAllFAQ(page));
}

exports.searchFAQ = async(req,res) => {
    var detail=req.query.detail;
    var page=req.query.page;
    res.send(await faqDAO.searchFAQ(detail,page));
};