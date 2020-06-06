import React from "react";

import Dashboard from "../Components/Dashboard";
import GameContainer from "./GameContainer";

class MatchContainer extends React.Component {

    componentDidMount(){
        // get the initial match details
        // set up the connection to the MatchChannel
    }

    render(){
        return (
            <div className="match-container">
                <Dashboard />
                <GameContainer />
            </div>
        );
    }
}

export default MatchContainer;