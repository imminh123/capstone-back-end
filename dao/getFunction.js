var nodemailer = require('nodemailer');

//get UTC time
exports.today = function(){

    var today = new Date();
    today = today.toUTCString();
    
    return today;

}

exports.isEmpty=function(...args){
  for (value of args) {
    if (value==null||value==undefined||value=='') return true;
  }
  return false;
}

//send email
exports.sendEmail = function(from,to,subject,id){

    const USER='NoteITFU@gmail.com';
    const PASSWORD='matkhaucuaNoteIT';

    if (from=='student') text = 'https://noteitfu.herokuapp.com/tutor/compose/'+id;
    else
      text = 'https://noteitfu.herokuapp.com/ask/compose/'+id;
      
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: USER,
          pass: PASSWORD
        }
    });

    var mailOptions = {
        from: USER,
        to: to.email,
        subject: subject,
        html: 'Click on this link read more: '+text
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent to:' + to.email + ' with info '+info.response);
        }
    });
    
}