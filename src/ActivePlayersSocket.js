
import { webSocketUrl } from "./requests";

/*
ActionCable.server.broadcast "ActivePlayerChannel", {type: "inactive", users: [current_user.id, params[:second_user_id]]}
ActionCable.server.broadcast "ActivePlayersChannel", {type: "challenge", message: {challenger: current_user, challenged: params[:id]}}
ActionCable.server.broadcast "ActivePlayersChannel", {type: "reject", message: {challenger: current_user, challenged: params[:id]}}
ActionCable.server.broadcast "ActivePlayersChannel", {type: "enter_lobby", message: cu}
*/

let socket = null;

const createActivePlayersWebsocketConnection = (capture_func) => {    
    // Creates the new websocket connection
    socket = new WebSocket(webSocketUrl);

    // When the connection is 1st created, this code runs subscribing the clien to a specific chatroom stream in the ChatRoomChannel
    socket.onopen = function(event) {
        console.log('ActivePlayers WebSocket is connected.', socket);

        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                channel: 'ActivePlayersChannel'
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
        
        console.log("ACTIVE PLAYERS MESSAGE RECEIVED", msg);

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

export default createActivePlayersWebsocketConnection;