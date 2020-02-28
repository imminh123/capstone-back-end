const NoteDAO = require('../dao/NoteDAO');

async function isEmpty(studentID,folderID,note,description,url,index){
    if ([studentID,folderID,note,description,url,index].includes(undefined)
        || [studentID,folderID,note,description,url,index].includes(null)
            || (studentID=="") || (folderID=="") || (note=="")
                || (description=="") || (url=="") || (index==""))
                return 1;
    return 0;
}

function msgEmpty(){
    var newObject = '{"message":"All field must be filled"}';
    return JSON.parse(newObject);
}

exports.createNote = async (req,res) => {
    var studentID=req.body.studentID;
    var folderID=req.body.folderID;
    var note=req.body.note;
    var description=req.body.description;
    var url=req.body.url;
    var index=req.body.index;
    //check if all fields are filled
    if (await isEmpty(studentID,folderID,note,description,url,index))
                res.send(msgEmpty()); 
        else {
            res.send(await NoteDAO.createNote(studentID,folderID,note,description,url,index));                    
        }
}
