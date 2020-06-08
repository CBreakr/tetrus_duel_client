
import { webSocketUrl } from "./requests";

let socket = null;

const createActiveMatchesWebsocketConnection = (capture_func) => {    
    // Creates the new websocket connection
    socket = new WebSocket(webSocketUrl);

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

    socket.onmessage = function(event) {            
        const response = event.data;
        const msg = JSON.parse(response);

        // Ignores pings
        if (msg.type === "ping" || msg.type === "confirm_subscription" || msg.type === "welcome") {
            return;
        } 

        console.log("ACTIVE MATCHES MESSAGE RECEIVED", msg);
        
        capture_func(msg.message);
    };

    socket.onclose = function(event) {
        console.log('WebSocket is closed.');
        // returnToMainPage();
    };

    socket.onerror = function(error) {
        console.log('WebSocket Error: ', error);
    };
}

export default createActiveMatchesWebsocketConnection;