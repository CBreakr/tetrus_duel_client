import React from "react";

import { withRouter } from "react-router-dom";

import { enterLobby } from "../requests";

import Dashboard from "../Components/Dashboard";
import RemoteGameContainer from "./RemoteGameContainer";

import AuthContext from "../AuthContext";

class SpectatorContainer extends React.Component {

    static contextType = AuthContext;

    returnToLobby = () => {
        enterLobby(this.context.token);
        this.props.history.push("/");
    }

    /*
        <RemoteGameContainer 
            winner_id={this.props.winner_id} 
            gamestate={opponent_gamestate} 
            game_id={opponent_game_id} 
        />
    */

    render() {
        return (
            <div>
                <button onClick={this.returnToLobby}>Return To Lobby</button>
                <Dashboard 
                        user1={this.props.user1} 
                        user2={this.props.user2} 
                        winner={this.props.winner}
                        spectator_view={true}
                    />
                SPECTATOR VIEW
            </div>
        )
    }
}

export default withRouter(SpectatorContainer);
