import React from "react";

import NextPiece from "../Components/NextPiece";
import GameBoard from "../Components/GameBoard";
import RemoteGameContainer from "./RemoteGameContainer";

import AuthContext from "../AuthContext";

class GameContainer extends React.Component {

    static contextType = AuthContext;

    render() {

        console.log("GAME PROPS", this.props);

        return (
            <>
            {
                this.props.match_users && this.props.match_users.includes(this.context.user.id)
                ? <div className="game-container">
                        <GameBoard />
                        <NextPiece />
                        <RemoteGameContainer />
                    </div>
                : <span>SPECTATOR VIEW</span>
            }
            </>
        )
    }
}

export default GameContainer;