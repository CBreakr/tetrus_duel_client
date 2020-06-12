import React from "react";

import RankDisplay from "../Components/RankDisplay";

class GameMatchupContainer extends React.Component {
    render() {
        return (
            <div>
                {
                    this.props.user1 && this.props.user2
                    ? (<span>
                        <RankDisplay key={this.props.user1.id} {...this.props.user1} /> 
                        &nbsp;VS&nbsp; 
                        <RankDisplay key={this.props.user2.id} {...this.props.user2} />
                    </span>)
                    : ""
                }
            </div>
        );
    }
}

export default GameMatchupContainer;