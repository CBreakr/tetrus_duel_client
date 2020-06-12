import React from "react";

import RankDisplay from "./RankDisplay";

class Dashboard extends React.Component {
    render() {

        console.log("DASHBOARD PROPS", this.props);

        /*
            user1={this.state.user1} 
            user2={this.state.user2} 
            winner={this.state.winner} 
            concede={this.concede}
        */

        return (
            <div className="dashboard">
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
                    ? <button onClick={this.props.concede}>Concede</button>
                    : ""
                }
            </div>
        );
    }
}

export default Dashboard;