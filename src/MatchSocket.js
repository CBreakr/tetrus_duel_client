
import { webSocketUrl } from "./requests";

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
    
    socket.onmessage = function(event) {            
        const response = event.data;
        const msg = JSON.parse(response);

        // Ignores pings
        if (msg.type === "ping" || msg.type === "confirm_subscription" || msg.type === "welcome") {
            return;
        } 

        console.log("MATCH MESSAGE RECEIVED", msg);

        if(msg && msg.message){
            capture_func(msg.message);
        }
    };

    socket.onclose = function(event) {
        console.log('WebSocket is closed.');
        // returnToMainPage();
    };
    
    socket.onerror = function(error) {
        console.log('WebSocket Error: ', error);
    };

    //
    // return the close socket method
    //
    return () => {
        if(socket){
            socket.close();
        }
    }
}

export default createMatchWebsocketConnection;