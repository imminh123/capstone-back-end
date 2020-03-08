const hlDAO = require('../dao/HighlightDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"Error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createHighlight = async (req, res, next) => {
    var studentid=req.body.studentID;
    var text=req.body.text;
    var index=req.body.index;
    var color=req.body.color;
    var url=req.body.url;
    var tags=req.body.tags;
    //check if all fields are filled
    if (isEmpty(studentid)||isEmpty(text)||isEmpty(index)||isEmpty(color)||isEmpty(url))
                res.send(msgEmpty());
    res.send(await hlDAO.createHighlight(studentid,text,index,color,url,tags));               
};

exports.getHighlightByID = async (req,res) => {
    var id=req.params['id'];
    res.send(await hlDAO.getHighlight(id));
}

exports.allHighlightByStudentID = async (req,res) => {
    var id=req.params['id'];
    res.send(await hlDAO.getAllHighlightByStudentID(id));
}

exports.deleteHighlightbyID = async (req,res) => {
    var id=req.params['id'];
    res.send(await hlDAO.deleteHighlight(id));
}

exports.updateHighlight = async (req,res) => {
    var id=req.params['id'];
    var text=req.body.text;
    var index=req.body.index;
    var color=req.body.color;
    var tags=req.body.tags;
    res.send(await hlDAO.updateHighlight(id,text,index,color,tags));
}