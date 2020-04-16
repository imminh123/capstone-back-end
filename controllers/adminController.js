const adminDAO = require('../dao/AdminDAO');

exports.getAllNumber = async (req, res) => {
    // res.setHeader("Content-Type", "application/json");
    res.send(await adminDAO.getAllNumber());
};

exports.getReport = async (req,res)=>{
    var teacher=req.query.teacher;
    var course=req.query.course;
    var from=req.query.from;
    var to=req.query.to;
    res.send(await adminDAO.getReport(teacher,course,from,to));
}