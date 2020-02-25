const adminDAO = require('../dao/AdminDAO');

exports.getAllNumber = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    // console.log('get all number called');
    res.send(await adminDAO.getAllNumber());
};