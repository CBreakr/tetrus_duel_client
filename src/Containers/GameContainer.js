import React from "react";

import GameBoard from "../Components/GameBoard";
import RemoteGameContainer from "./RemoteGameContainer";

import AuthContext from "../AuthContext";

class GameContainer extends React.Component {

    static contextType = AuthContext;

    render() {

        console.log("GAME PROPS", this.props);
        console.log("GAME CONTEXT", this.context);

        /*
        game1_id: null,
        game2_id: null,
        user1: null,
        user2: null,
        user1_gamestate: null,
        user2_gamestate: null,
        */

        let current_game_id = null;
        let opponent_game_id = null;
        let opponent_gamestate = null;

        if(this.props.user1.id === this.context.user.id){
            console.log("USER ONE", "U2GS", this.props.user2_gamestate);
            current_game_id = this.props.game1_id;
            opponent_game_id = this.props.game2_id;
            opponent_gamestate = this.props.user2_gamestate;
        }
        else if(this.props.user2.id === this.context.user.id){
            console.log("USER 2", "U1GS", this.props.user1_gamestate);
            current_game_id = this.props.game2_id;
            opponent_game_id = this.props.game1_id;
            opponent_gamestate = this.props.user1_gamestate;
        }

        console.log("id's", this.context.user.id, this.props.user1.id, this.props.user2.id);
        console.log("OPPONENT GAMESTATE", opponent_gamestate);
        console.log("game_ids", current_game_id, opponent_game_id);

        return (
            <>
            {
                current_game_id
                ? <div className="game-container">
                        <RemoteGameContainer 
                            winner_id={this.props.winner_id} 
                            gamestate={opponent_gamestate} 
                            game_id={opponent_game_id} 
                        />
                        <GameBoard 
                            winner_id={this.props.winner_id} 
                            game_id={current_game_id} 
                            sendUpdate={this.props.sendUpdate} 
                        />
                    </div>
                : <span>SPECTATOR VIEW</span>
            }
            </>
        )
    }
}

export default GameContainer;