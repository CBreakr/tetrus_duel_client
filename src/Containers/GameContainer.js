import React from "react";

import NextPiece from "../Components/NextPiece";
import GameBoard from "../Components/GameBoard";
import RemoteGameContainer from "./RemoteGameContainer";

import AuthContext from "../AuthContext";

class GameContainer extends React.Component {

    static contextType = AuthContext;

    render() {
        return (
            <div className="game-container">
                <GameBoard />
                <NextPiece />
                <RemoteGameContainer />
            </div>
        )
    }
}

export default GameContainer;