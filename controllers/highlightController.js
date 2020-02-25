const hlDAO = require('../dao/HighlightDAO');

async function isEmpty(studentid,text,index,color,url){
    if ([studentid,text,index,color,url].includes(undefined)
        || [studentid,text,index,color,url].includes(null)
            || (studentid=="")||(text=="")||(index=="")||(color=="")||(url==""))
                return 1;
    return 0;
}

exports.createHighlight = async (req, res, next) => {
    // console.log('create highlight called');
    var studentid=req.body.studentID;
    var text=req.body.text;
    var index=req.body.index;
    var color=req.body.color;
    var url=req.body.url;
    // console.log("request return "+studentid+" "+text+" "+index+" "+color+" "+url);
    //check if all fields are filled
    if (await isEmpty(studentid,text,index,color,url))
                res.status(200).send("All field must be filled");
    // if (await hlDAO.createHighlight(studentid,text,index,color,url)==0)
    //         res.status(200).send("There's an error");
    //         else
    await hlDAO.createHighlight(studentid,text,index,color,url);
    res.status(201).send("Highlight created");                    
};