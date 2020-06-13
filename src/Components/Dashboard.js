import React from "react";

import RankDisplay from "./RankDisplay";

class Dashboard extends React.Component {
    render() {
        return (
            <div className="dashboard">
                {
                    !this.props.winner_id
                    ? <>
                        <div>
                            <p>
                                <RankDisplay {...this.props.user1} />
                            </p>
                            <p>
                                <RankDisplay {...this.props.user2} />
                            </p>
                        </div>
                        {
                            !this.props.spectator_view
                            && this.props.completed_handshakes
                            ? <button onClick={this.props.concede}>Concede</button>
                            : ""
                        }
                    </>
                    : ""
                }
            </div>
        );
    }
}

export default Dashboard;