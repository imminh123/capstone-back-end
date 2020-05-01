var nodemailer = require('nodemailer');

//get UTC time
exports.today = function(){

    var today = new Date();
    today = today.toUTCString();
    
    return today;

}

exports.makeJson = function(type,msg){

    var newObject = '{"'+type+'":"'+msg+'"}';
    return JSON.parse(newObject);

}

//send email
exports.sendEmail = function(to,subject,text){

    const USER='icebolt1996@gmail.com';
    const PASSWORD='hovatenTQT001';

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
        html: text
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent to:' + to.email + ' with info '+info.response);
        }
    });
    
}