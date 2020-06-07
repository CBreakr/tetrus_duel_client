
import { webSocketUrl } from "./requests";

/*
MatchChannel.broadcast_to(match, {type:"match_state", {gamestate: game}})
MatchChannel.broadcast_to(match, {type: "match_start"})
MatchChannel.broadcast_to(match, {type:"match_over", message: {losing_game: game_id}})
*/

let socket = null;

const createMatchWebsocketConnection = (match_id, capture_func) => {    
    // Creates the new websocket connection
    socket = new WebSocket(webSocketUrl);

    socket.onopen = function(event) {
        console.log('MATCH WebSocket is connected.', socket);

        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                id: match_id,
                channel: 'MatchChannel'
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

        console.log("MATCH MESSAGE RECEIVED", msg);

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

export default createMatchWebsocketConnection;