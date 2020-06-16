import React from "react";

import { withRouter } from "react-router-dom";

import { startSoloGame } from "../requests";

import RankDisplay from "./RankDisplay";

import AuthContext from "../AuthContext";

class MainPlayerDisplay extends React.Component {

    static contextType = AuthContext;

    playSolo = () => {
        // create a new game on the server
        // return the ID info and use that to redirect

        startSoloGame(this.context.token)
        .then(res => {
            console.log("PLAY SOLO", res);
            this.props.history.push(`/games/${res.data.id}`);
        })
    }

    render() {
        return (
            <div className="main-player-display">
                <RankDisplay {...this.context.user} /> 
                <button onClick={this.playSolo}>Play Solo</button>
            </div>
        );
    }
}

export default withRouter(MainPlayerDisplay);