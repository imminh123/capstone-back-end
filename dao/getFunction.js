exports.today = function(){

    var today = new Date();
    today = today.toUTCString();
    
    return today;

}
