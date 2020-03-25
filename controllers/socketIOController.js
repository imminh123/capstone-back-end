const AskDAO = require('../dao/AskDAO');

module.exports = function(wss, websocket) { 

    wss.on('connection', function connection(ws) {
        ws.on('message', async function incoming(data) {
            const {message, user, askID } = JSON.parse(data);
            const messageCreate = await AskDAO.addComment(askID,user.profile,message);
            wss.clients.forEach( function each(client) {
                if (client.readyState === websocket.OPEN) {
                    console.log(messageCreate);
                    client.send(JSON.stringify(messageCreate));
                } 
            });
        });
      });

} 