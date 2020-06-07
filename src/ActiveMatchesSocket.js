
import { webSocketUrl } from "./requests";

/*
ActionCable.server.broadcast "ActiveMatchesChannel", {type: "match_created", match: match}
ActionCable.server.broadcast "ActiveMatchesChannel", {type: "match_ended", match: match}
*/

let socket = null;

const createActiveMatchesWebsocketConnection = (capture_func) => {    
    // Creates the new websocket connection
    socket = new WebSocket(webSocketUrl);

    // When the connection is 1st created, this code runs subscribing the clien to a specific chatroom stream in the ChatRoomChannel
    socket.onopen = function(event) {
        console.log('ACTIVE MATCHES WebSocket is connected.', socket);

        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                channel: 'ActiveMatchesChannel'
            }),
        };

        socket.send(JSON.stringify(msg));
    };

    // When a message is received through the websocket, this code is run
    socket.onmessage = function(event) {            
        const response = event.data;
        const msg = JSON.parse(response);

        // Ignores pings
        if (msg.type === "ping" || msg.type === "confirm_subscription" || msg.type === "welcome") {
            return;
        } 

        console.log("ACTIVE MATCHES MESSAGE RECEIVED", msg);
        
        capture_func(msg);
    };

    // When the connection is closed, this code is run
    socket.onclose = function(event) {
        console.log('WebSocket is closed.');
        // returnToMainPage();
    };
    
    // When an error occurs through the websocket connection, this code is run printing the error message
    socket.onerror = function(error) {
        console.log('WebSocket Error: ', error);
    };
}

export default createActiveMatchesWebsocketConnection;