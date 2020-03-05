module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('New connection');
        socket.on('join', (data, callback) => {
            console.log(data);   
            socket.emit('hello', 'Helllo user this is server calling');
            // //send to everyone else in the room
            // socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined!`});
            // socket.join(user.room);
     
            callback(); 
        });
    
        // socket.on('sendMessage', (message, callback) => {
        //     const user = getUser(socket.id);
        //     io.to(user.room).emit('message', {user: user.name, text: message});
       
        //     callback();  
        // }) 
        
        socket.on('disconect', () => {
            // const user= removeUser(socket.id);
            // if(user) {
            //     io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left.`} )
            // }
            console.log('User has left!!!');
        }) 
    });

} 