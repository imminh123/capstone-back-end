const userDAO = require('../dao/UserDAO');

exports.createUser = async (req, res, next) => {
    var email=req.body.email;
    var password=req.body.password;
    var google=req.body.google;
    var tokens=req.body.tokens;
    var role=req.body.role;
    var profile=req.body.profile;
    res.send(await userDAO.createUser(email,google,tokens,role,profile,password));               
};

exports.getUserByID = async (req,res) => {
    var id=req.params['id'];
    res.send(await userDAO.getUserByID(id));
}

exports.chooseRole = async (req,res) => {
    var email=req.body.email;
    var role=req.body.role;
    // res.send(await userDAO.chooseRole(email,role));
    var user=await userDAO.chooseRole(email,role);
    if (user.error) res.send({error:user.error});
    console.log('new user '+user);
    
    res.status(200).redirect('https://noteitfu.herokuapp.com');

}

exports.getAllUser = async (req,res) => {
    res.send(await userDAO.getAllUser());
}

exports.deleteUser = async (req,res) => {
    var id=req.params['id'];
    res.send(await userDAO.deleteUser(id));
}