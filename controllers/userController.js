const userDAO = require('../dao/UserDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"Error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createUser = async (req, res, next) => {
    var email=req.body.email;
    var google=req.body.google;
    var tokens=req.body.tokens;
    var role=req.body.role;
    var profile=req.body.profile;
    console.log(email);
    console.log(google);
    console.log(tokens);
    console.log(role);
    console.log(profile);
    //check if all fields are filled
    // if (isEmpty(email)||isEmpty(google)||isEmpty(tokens)||isEmpty(role)||isEmpty(profile))
    //             res.send(msgEmpty());
    res.send(await userDAO.createUser(email,google,tokens,role,profile));               
};

exports.getUserByID = async (req,res) => {
    var id=req.params['id'];
    res.send(await userDAO.getUserByID(id));
}