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

        let opponent = null;

        let penaltyRows = 0;

        if(this.props.user1.id === this.context.user.id){
            current_game_id = this.props.game1_id;
            opponent_game_id = this.props.game2_id;
            opponent_gamestate = this.props.user2_gamestate;
            penaltyRows = this.props.penaltyRows_for_game1;
            opponent = this.props.user2;
        }
        else if(this.props.user2.id === this.context.user.id){
            current_game_id = this.props.game2_id;
            opponent_game_id = this.props.game1_id;
            opponent_gamestate = this.props.user1_gamestate;
            penaltyRows = this.props.penaltyRows_for_game2;
            opponent = this.props.user1;
        }

        console.log("OPPONENT GAMESTATE", opponent_gamestate);
        console.log("game_ids", current_game_id, opponent_game_id);
        console.log("PENALTY ROWS:", penaltyRows);

        return (
            <>
            {
                current_game_id
                ? <>
                    <div className="game-container">
                        <div className="remote-match-column">
                            <div>
                                <RemoteGameContainer 
                                    user={opponent}
                                    winner_id={this.props.winner_id} 
                                    gamestate={opponent_gamestate} 
                                    game_id={opponent_game_id} 
                                />
                            </div>
                            <span className="concede-button-container">
                                <button onClick={this.props.concede}>Concede</button>
                            </span>
                        </div>
                        <GameBoard 
                            winner_id={this.props.winner_id} 
                            game_id={current_game_id} 
                            sendUpdate={this.props.sendUpdate} 
                            penaltyRows={penaltyRows}
                            rand={Math.random()}
                        />
                    </div>
                </>
                : <span>SPECTATOR VIEW??</span>
            }
            </>
        )
    }
}

export default GameContainer;