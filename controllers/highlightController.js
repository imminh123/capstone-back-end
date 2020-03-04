const hlDAO = require('../dao/HighlightDAO');

async function isEmpty(studentid,text,index,color,url){
    if ([studentid,text,index,color,url].includes(undefined)
        || [studentid,text,index,color,url].includes(null)
            || (studentid=="")||(text=="")||(index=="")||(color=="")||(url==""))
                return 1;
    return 0;
}

exports.createHighlight = async (req, res, next) => {
    var studentid=req.body.studentID;
    var text=req.body.text;
    var index=req.body.index;
    var color=req.body.color;
    var url=req.body.url;
    //check if all fields are filled
    if (await isEmpty(studentid,text,index,color,url))
                res.status(200).send("All field must be filled");
    res.send(await hlDAO.createHighlight(studentid,text,index,color,url));               
};