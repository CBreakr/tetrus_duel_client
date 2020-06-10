import React from "react";

import createMatchWebsocketConnection from "../MatchSocket";

import { withRouter } from "react-router-dom";

import { getMatchDetails, acceptMatchHandshake } from "../requests";

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
        user1_gamestate: null,
        user2_gamestate: null,
        winner_id: null,
        my_handshake: false,
        completed_handshakes: false
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
    MatchChannel.broadcast_to(match, {type:"match_over", winner_id: match.winner_id})
    */
    capture_func = (message) => {
        console.log("we have a Match socket message", message);
        // everything for this socket should only be for this match in particular
        switch(message.type){
            case "match_start":
                this.setState({completed_handshakes: true});
                break;
            case "match_over":
                // hmm, what do I do here?
                console.log("THE MATCH IS OVER!!!!", message.winner_id)
                this.setState({winner_id: message.winner_id});
                break;
            case "match_update":
                console.log("MATCH UPDATE", message.gamestate)
                const currentGameId = this.getCurrentGameId();
                
                if(currentGameId && currentGameId !== message.game_id){
                    if(message.game_id === this.state.game1_id){
                        this.setState({user1_gamestate: message.gamestate});
                    }
                    else{
                        this.setState({user2_gamestate: message.gamestate});
                    }
                }
                break;
        }
    }

    getCurrentGameId = () => {
        if(this.context.user.id === this.state.user1.id){
            return this.state.game1_id;
        }
        else if(this.context.user === this.state.user2.id) {
            return this.state.game2_id;
        }

        return null;
    }

    handshake = () => {
        acceptMatchHandshake(this.context.token, this.state.match_id)
        .then(res => {
            this.setState({my_handshake: true});
        });
    }

    sendUpdate = (gamestate) => {
        console.log("SEND UPDATE", gamestate);
    }

    render(){

        console.log("match container state", this.state);

        return (
            <>
            {
                this.state.user1 && this.state.user2
                ? <div className="match-container">
                    <Dashboard user1={this.state.user1} user2={this.state.user2} winner={this.state.winner} />
                    {
                        !this.state.my_handshake
                        ? <button onClick={this.handshake}>Ready</button>
                        : <>
                        {
                            !this.state.completed_handshakes
                            ? <span>Waiting for opponent...</span>
                            : <GameContainer {...this.state} sendUpdate={this.sendUpdate} />
                        }
                        </>
                    }
                </div>
                : <span>LOADING...</span>
            }
            </>
        );
    }
}

export default withRouter(MatchContainer);