const adminDAO = require('../dao/AdminDAO');

exports.getAllNumber = async (req, res) => {
    // res.setHeader("Content-Type", "application/json");
    res.send(await adminDAO.getAllNumber());
};