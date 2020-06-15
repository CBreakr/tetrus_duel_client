import React from "react";

import RankDisplay from "./RankDisplay";

class PlayerDisplay extends React.Component {

    render() {
        console.log("Player Props", this.props, this.props.issued_challenge, this.props.challenge_issued_id);

        return (
            <div>
                <div className="player-display">
                    <RankDisplay {...this.props} />
                    {
                        /* both sides must be challenge-free */
                        !this.props.issued_challenge 
                        && !this.props.challenge_issued_id 
                        && !this.props.challenges_issued_by.includes(this.props.id)
                        ? <button onClick={() => this.props.createChallenge(this.props.id)}>Challenge</button>
                        : ""
                    }
                    {
                        this.props.challenge_issued_id === this.props.id
                        ? <button onClick={() => this.props.cancelChallenge(this.props.id)}>Cancel Challenge</button>
                        : ""
                    }         
                </div>
            </div>
        );
    }
}

export default PlayerDisplay;