const hlDAO = require('../dao/HighlightDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createHighlight = async (req, res, next) => {
    var studentid=req.body.studentID;
    var scannedContent=req.body.scannedContent;
    var index=req.body.index;
    var color=req.body.color;
    var url=req.body.url;
    var tags=req.body.tags;
    var folderID=req.body.folderID;
    //check if all fields are filled
    if (isEmpty(studentid)||isEmpty(scannedContent)||isEmpty(index)||isEmpty(color)||isEmpty(url)||isEmpty(folderID))
                res.send(msgEmpty());
    res.send(await hlDAO.createHighlight(studentid,scannedContent,index,color,url,tags,folderID));               
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
    var scannedContent=req.body.scannedContent;
    var index=req.body.index;
    var color=req.body.color;
    var tags=req.body.tags;
    var folderID=req.body.folderID;
    if (isEmpty(scannedContent)||isEmpty(index)||isEmpty(color)||isEmpty(folderID)) res.send(msgEmpty());
    res.send(await hlDAO.updateHighlight(id,folderID,scannedContent,index,color,tags));
}

exports.getHighlightByUrl = async (req,res) => {
    var id=req.params['studentID'];
    var url=req.params['url'];
    res.send(await hlDAO.getHighlightByUrl(id,url));
}

exports.searchHighLight = async (req,res) => {
    var studentID=req.params['studentID'];
    var scannedContent=req.params['text'];
    res.send(await hlDAO.searchHighlight(scannedContent,studentID));
}

exports.getHighlightByColor =async(req,res) => {
    var studentID=req.params['studentID'];
    var folderID=req.params['folderID'];
    var color=req.params['color'];
    res.send(await hlDAO.getHighlightByColor(color,studentID,folderID));
}

exports.getRecentHighlight = async (req,res) => {
    var studentID=req.params['studentID'];
    var limit=req.params['limit'];
    res.send(await hlDAO.getRecentHighlight(studentID,limit));
}
