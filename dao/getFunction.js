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