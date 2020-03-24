const AskDAO = require('../dao/AskDAO');

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('New connection'); 
        socket.on('join', (data, callback) => {
            const {askID} = data;
            console.log(data);    
            socket.emit('hello', 'Helllo user this is server calling');
            // //send to everyone else in the room
            socket.broadcast.to(askID).emit('message', 'New user has joined!');
            socket.join(askID);
     
            callback(); 
        });
    
        socket.on('send message', async (data, callback) =>  {
            const {message, user, askID } = data;
            const messageCreate = await AskDAO.addComment(askID,user.profile,message);

            if(messageCreate) {
                io.to(askID).emit('message', {user: user, message: messageCreate});
            }

            callback();   
        }) 
        
        socket.on('disconect', () => {
            // const user= removeUser(socket.id);
            console.log('User has left!!!');
        }) 

        socket.on('close', function() {
            console.log('closed connection %s');
          });
    });

} 