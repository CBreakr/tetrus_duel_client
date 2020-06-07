import React from "react";

import createActivePlayersWebsocketConnection from "../ActivePlayersSocket";

import PlayerDisplay from "../Components/PlayerDisplay";

class LobbyContainer extends React.Component {

    componentDidMount(){
        // get the currently active players
        // set up the subscription to the ActivePlayerChannel
        createActivePlayersWebsocketConnection(this.capture_func);
    }

    capture_func = (socket_message) => {

    }

    addPlayerToLobby = (player) => {

    }

    removePlayerFromLobby = (player) => {

    }

    markPlayerUnavailable = (player) => {

    }

    markPlayerInactive = (player) => {

    }

    render(){
        return (
            <div>LOBBY</div>
        );
    }
}

export default LobbyContainer;