import React from "react";

import GameBoard from "../Components/GameBoard";

class RemoteGameContainer extends React.Component {
    render() {
        return (
            <div className="remote">
                <GameBoard is_remote={true} gamestate={this.props.gamestate} game_id={this.props.game_id} />
            </div>
        )
    }
}

export default RemoteGameContainer;