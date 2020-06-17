import React from "react";

import GameBoard from "../Components/GameBoard";
import SmileyFaceGrid from "../Components/SmileyFaceGrid";

class RemoteGameContainer extends React.Component {
    render() {
        return (
            <div className="remote">
                {
                    this.props.winner_id
                    ? (
                        <>
                        {
                            this.props.user.id === this.props.winner_id
                            ? (
                                <div>
                                    <div className="win">{this.props.user.name} Wins!</div>
                                    <SmileyFaceGrid is_winner={true} />
                                </div>
                                )
                            : (
                                <div>
                                    <div className="lose">{this.props.user.name} Loses</div>
                                    <SmileyFaceGrid is_winner={false} />
                                </div>
                            )
                        }
                        </>
                        )
                    : <GameBoard user={this.props.user} is_remote={true} gamestate={this.props.gamestate} game_id={this.props.game_id} />
                }
            </div>
        )
    }
}

export default RemoteGameContainer;