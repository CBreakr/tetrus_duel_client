import React from "react";

import PlayerDisplay from "../Components/PlayerDisplay";

class GameMatchupContainer extends React.Component {
    render() {
        return (
            <div>
                {
                    this.props.user1 && this.props.user2
                    ? <span>{`${this.props.user1.name}(${this.props.user1.rank}) VS ${this.props.user2.name}(${this.props.user2.rank})`}</span>
                    : ""
                }
            </div>
        );
    }
}

export default GameMatchupContainer;