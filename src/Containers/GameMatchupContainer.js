import React from "react";

import { withRouter } from "react-router-dom";

import RankDisplay from "../Components/RankDisplay";

class GameMatchupContainer extends React.Component {

    viewMatch = () => {
        this.props.history.push(`/matches/${this.props.match_id}`);
    }

    render() {
        return (
            <div className="matchup">
                {
                    this.props.user1 && this.props.user2
                    ? (<span>
                        <RankDisplay key={this.props.user1.id} {...this.props.user1} /> 
                        &nbsp;VS&nbsp; 
                        <RankDisplay key={this.props.user2.id} {...this.props.user2} />
                        <button onClick={this.viewMatch}>View</button>
                    </span>)
                    : ""
                }
            </div>
        );
    }
}

export default withRouter(GameMatchupContainer);