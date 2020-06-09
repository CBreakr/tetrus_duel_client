import React from "react";

import createMatchWebsocketConnection from "../MatchSocket";

import { withRouter } from "react-router-dom";

import { getMatchDetails } from "../requests";

import Dashboard from "../Components/Dashboard";
import GameContainer from "./GameContainer";

import AuthContext from "../AuthContext";

class MatchContainer extends React.Component {

    state = {
        match_id: null,
        game1_id: null,
        game2_id: null,
        user1: null,
        user2: null,
        winner_id: null
    }

    static contextType = AuthContext;

    /*
    I need to load in the basic game information here:
        - the users and game_ids
    */

    componentDidMount(){
        // get the initial match details based on id
        // set up the connection to the MatchChannel

        console.log("path for match", this.props.location.pathname);

        // really get this from the path

        const match_id = this.props.location.pathname.split("/")[2];

        console.log("MATCH TOKEN", this.context.token);

        getMatchDetails(this.context.token, this.props.location.pathname)
        .then(res => {
            console.log("got match", res.data);
            this.setState({
                match_id,
                game1_id: res.data.game1_id,
                game2_id: res.data.game2_id,
                user1: res.data.user1,
                user2: res.data.user2,
                winner_id: res.data.winner_id
            }, () => {
                console.log("create match websocket connection");
                createMatchWebsocketConnection(this.state.match_id, this.capture_func);
            })
        });        
    }

    /*
    MatchChannel.broadcast_to(match, {type:"match_state", {gamestate: game}})
    MatchChannel.broadcast_to(match, {type: "match_start"})
    MatchChannel.broadcast_to(match, {type:"match_over", message: {losing_game: game_id}})
    */
    capture_func = (message) => {
        console.log("we have a Match socket message", message);
    }

    render(){
        return (
            <>
            {
                this.state.user1 && this.state.user2
                ? <div className="match-container">
                    <Dashboard user1={this.state.user1} user2={this.state.user2} winner={this.state.winner} />
                    <GameContainer {...this.state} />
                </div>
                : <span>LOADING...</span>
            }
            </>            
        );
    }
}

export default withRouter(MatchContainer);