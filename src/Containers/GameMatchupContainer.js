import React from "react";

import RankDisplay from "../Components/RankDisplay";

class GameMatchupContainer extends React.Component {
    render() {
        return (
            <div>
                {
                    this.props.user1 && this.props.user2
                    ? (<span>
                        <RankDisplay {...this.props.user1} /> 
                        &nbsp;VS&nbsp; 
                        <RankDisplay {...this.props.user2} />
                    </span>)
                    : ""
                }
            </div>
        );
    }
}

export default GameMatchupContainer;