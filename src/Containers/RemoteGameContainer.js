import React from "react";

import GameBoard from "../Components/GameBoard";

class RemoteGameContainer extends React.Component {
    render() {
        return (
            <div className="remote">
                <GameBoard />
            </div>
        )
    }
}

export default RemoteGameContainer;