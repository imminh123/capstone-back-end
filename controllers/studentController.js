const StudentDAO = require('../dao/StudentDAO');

exports.updateStudentCourse = async (req,res) => {
    var studentID=req.params['id'];
    var courses=req.body.courses;
    console.log(courses);
    res.send(await StudentDAO.updateCourseOfStudent(studentID,courses));                    
}

exports.getStudentByID = async (req,res) => {
    var studentID=req.params['id'];
    res.send(await StudentDAO.getStudentByID(studentID));
}

exports.allStudent = async (req,res) => {
    res.send(await StudentDAO.allStudent());
}

exports.getStudentStatistic = async (req,res) => {
    var id=req.params['id'];
    res.send(await StudentDAO.getStudentStatistic(id));
}