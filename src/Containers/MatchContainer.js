import React from "react";

import createMatchWebsocketConnection from "../MatchSocket";

import Dashboard from "../Components/Dashboard";
import GameContainer from "./GameContainer";

class MatchContainer extends React.Component {

    state = {
        match_id: null
    }

    componentDidMount(){
        // get the initial match details based on id
        // set up the connection to the MatchChannel

        // really get this from the path
        const match_id = 1;
        this.setState({
            match_id
        }, () => {
            createMatchWebsocketConnection(this.state.match_id, this.capture_func);
        })
    }

    capture_func = (message) => {

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