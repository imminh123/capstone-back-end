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
    var course=req.body.course;
    //check if all fields are filled
    if (isEmpty(studentid)||isEmpty(scannedContent)||isEmpty(index)||isEmpty(color)||isEmpty(url)||isEmpty(course))
                res.send(msgEmpty());
    res.send(await hlDAO.createHighlight(studentid,scannedContent,index,color,url,tags,course));               
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
    var course=req.body.course;
    if (isEmpty(scannedContent)||isEmpty(index)||isEmpty(color)||isEmpty(course)) res.send(msgEmpty());
    res.send(await hlDAO.updateHighlight(id,course,scannedContent,index,color,tags));
}

exports.getHighlightByUrl = async (req,res) => {
    var id=req.body.studentID;
    var url=req.body.url;
    if (isEmpty(id)||isEmpty(url)) res.send(msgEmpty());
    res.send(await hlDAO.getHighlightByUrl(id,url));
}

exports.searchHighLight = async (req,res) => {
    var sID=req.params['studentID'];
    var scannedContent=req.params['text'];
    if (isEmpty(scannedContent)||isEmpty(sID)) res.send(msgEmpty());
    res.send(await hlDAO.searchHighlight(scannedContent,sID));
}

exports.getHighlightByCourse = async (req,res) => {
    var sID=req.params['studentID'];
    var course=req.params['courseID'];
    if (isEmpty(course)||isEmpty(sID)) res.send(msgEmpty());
    res.send(await hlDAO.getHighlightByCourse(course,sID));
}

exports.deleteHighlightByCourseID = async (req,res) => {
    var sID=req.params['studentID'];
    var course=req.params['courseID'];
    if (isEmpty(course)||isEmpty(sID)) res.send(msgEmpty());
    res.send(await hlDAO.deleteHLByCourseID(sID,course));
}

exports.getHighlightByColor =async(req,res) => {
    var sID=req.params['studentID'];
    var color=req.params['color'];
    if (isEmpty(color)||isEmpty(sID)) res.send(msgEmpty());
    res.send(await hlDAO.getHighlightByColor(color,sID));
}

exports.getRecentHighlight = async (req,res) => {
    var sID=req.params['studentID'];
    var limit=req.params['limit'];
    if (isEmpty(sID)) res.send(msgEmpty());
    res.send(await hlDAO.getRecentHighlight(sID,limit));
}
