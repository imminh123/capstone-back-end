const userDAO = require('../dao/UserDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createUser = async (req, res, next) => {
    var email=req.body.email;
    var google=req.body.google;
    var tokens=req.body.tokens;
    var role=req.body.role;
    var profile=req.body.profile;
    res.send(await userDAO.createUser(email,google,tokens,role,profile));               
};

exports.getUserByID = async (req,res) => {
    var id=req.params['id'];
    res.send(await userDAO.getUserByID(id));
}