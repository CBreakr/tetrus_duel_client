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
                <div className="spectator-container">
                    <RemoteGameContainer 
                        winner_id={this.props.winner_id} 
                        user={this.props.user1}
                        gamestate={this.props.user1_gamestate} 
                        game_id={this.props.game1_id} 
                    />

                    <RemoteGameContainer 
                        winner_id={this.props.winner_id} 
                        user={this.props.user2}
                        gamestate={this.props.user2_gamestate} 
                        game_id={this.props.game2_id} 
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(SpectatorContainer);
