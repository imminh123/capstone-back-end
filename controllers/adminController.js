const adminDAO = require('../dao/AdminDAO');

exports.getAllNumber = async (req, res) => {
    // res.setHeader("Content-Type", "application/json");
    res.send(await adminDAO.getAllNumber());
};

exports.getReport = async (req,res)=>{
    var teachers=req.query.teachers;
    var courses=req.query.courses;
    var startDate=req.query.startDate;
    var endDate=req.query.endDate;
    res.send(await adminDAO.getReport(teachers,courses,startDate,endDate));
}