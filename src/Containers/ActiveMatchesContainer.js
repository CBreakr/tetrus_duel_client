import React from "react";

import createActiveMatchesWebsocketConnection from "../ActiveMatchesSocket";

import GameMatchupContainer from "./GameMatchupContainer";

class ActiveMatchesContainer extends React.Component {

    componentDidMount(){
        // get the currently active matches
        // set up the subscription to the ActiveMatchChannel
        createActiveMatchesWebsocketConnection(this.capture_func)
    }

    /*
    ActionCable.server.broadcast "ActiveMatchesChannel", {type: "match_created", match: match}
    ActionCable.server.broadcast "ActiveMatchesChannel", {type: "match_ended", match: match}
    */
    capture_func = (socket_message) => {

    }

    render() {
        return (
            <div>Active Matches</div>
        );
    }
}

export default ActiveMatchesContainer;