const FolderDAO = require('../dao/FolderDAO');

function isEmpty(str){
    if (str==null||str==undefined||str=='') return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"Error":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.getFolderByStudentID = async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    res.send(await FolderDAO.getFolderByStudentID(id));
};

exports.createFolder = async (req, res) => {
    var folderName=req.body.folderName;
    var studentID=req.body.studentID;
    //check if all fields are filled
    if (isEmpty(folderName)||isEmpty(studentID))
                res.send(msgEmpty()); 
        else {
            res.send(await FolderDAO.createFolder(folderName,studentID));                    
        }
};

exports.changeFolderName = async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    var folderName=req.body.folderName;
    //check all fields are filled
    if (isEmpty(folderName))
                res.send(msgEmpty()); 
        else {
            res.send(await FolderDAO.changeFolderName(id,folderName));                       
        }
};

exports.deleteFolder =async (req,res) => {
    // res.setHeader("Content-Type", "application/json");
    var id=req.params['id'];
    res.send(await FolderDAO.deleteFolder(id));
};