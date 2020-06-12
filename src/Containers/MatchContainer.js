import React from "react";

import createMatchWebsocketConnection from "../MatchSocket";

import { withRouter } from "react-router-dom";

import { 
        getMatchDetails, 
        acceptMatchHandshake, 
        updateMatch, 
        enterLobby, 
        concedeMatch 
    } from "../requests";

import Dashboard from "../Components/Dashboard";
import GameContainer from "./GameContainer";
import SpectatorContainer from "./SpectatorContainer";

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
        completed_handshakes: false,
        closeSocket: null
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
                const closeSocket = createMatchWebsocketConnection(this.state.match_id, this.capture_func);
                this.setState({closeSocket});
            })
        });        
    }

    componentWillUnmount(){
        console.log("UNMOUNT Match");
        if(this.state.closeSocket){
            console.log("do we have the close function");
            this.state.closeSocket();
        }
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
            case "match_ended":
                // hmm, what do I do here?
                console.log("THE MATCH IS OVER!!!!", message.winner_id)
                this.setState({winner_id: message.winner_id});
                break;
            case "match_update":
                console.log("MATCH UPDATE", message.gamestate)
                const currentGameId = this.getCurrentGameId();

                console.log("current game id", currentGameId);
                
                // if(currentGameId && currentGameId !== message.game_id){
                //     console.log("opponent game match");
                //     if(message.gamestate.game_id === this.state.game1_id){
                //         console.log("update game 1", message.gamestate);
                //         this.setState({user1_gamestate: message.gamestate});
                //     }
                //     else if(message.gamestate.game_id === this.state.game2_id){
                //         console.log("update game 2", message.gamestate);
                //         this.setState({user2_gamestate: message.gamestate});
                //     }
                // }

                if(message.gamestate.game_id === this.state.game1_id){
                    console.log("update game 1", message.gamestate);
                    this.setState({user1_gamestate: message.gamestate});
                }
                else if(message.gamestate.game_id === this.state.game2_id){
                    console.log("update game 2", message.gamestate);
                    this.setState({user2_gamestate: message.gamestate});
                }

                break;
        }
    }

    getCurrentGameId = () => {
        console.log("get curretn game id", this.context.user.id, this.state.user1.id, this.state.user2.id);
        if(this.context.user.id === this.state.user1.id){
            return this.state.game1_id;
        }
        else if(this.context.user.id === this.state.user2.id) {
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
        updateMatch(this.context.token, this.state.match_id, gamestate)
        .then(res => {
            // is there anything to do here?
            // I think this is just up the the sockets now
        });
    }

    returnToLobby = () => {
        enterLobby(this.context.token);
        this.props.history.push("/");
    }

    concede = () => {
        const game_id = this.getCurrentGameId();

        if(game_id){
            concedeMatch(this.context.token, this.state.match_id, game_id);
        }
    }

    //
    //
    //
    //
    //
    render(){

        console.log("match container state", this.state);

        return (
            <>
            {
                this.state.user1 && this.state.user2
                && (this.context.user.id === this.state.user1.id
                    || this.context.user.id === this.state.user2.id)
                ? <div className="match-container">
                    <Dashboard 
                        user1={this.state.user1} 
                        user2={this.state.user2} 
                        winner={this.state.winner} 
                        concede={this.concede}
                        completed_handshakes={this.state.completed_handshakes}
                    />
                    {
                        !this.state.my_handshake
                        ? <button onClick={this.handshake}>Ready</button>
                        : <>
                        {
                            !this.state.winner_id
                            ? <> {
                                !this.state.completed_handshakes
                                ? <span>Waiting for opponent...</span>
                                : <GameContainer 
                                    {...this.state} 
                                    sendUpdate={this.sendUpdate} 
                                />
                            }
                            </>
                            : <>
                            {
                                this.state.winner_id === this.context.user.id
                                ? (
                                    <div>
                                        <span className="win">YOU WIN</span>
                                        <button onClick={this.returnToLobby}>Return to Lobby</button>
                                    </div>
                                )
                                : (
                                    <div>
                                        <span className="lose">YOU LOSE</span>
                                        <button onClick={this.returnToLobby}>Return To Lobby</button>
                                    </div>
                                )
                            }
                            </>
                        }
                        </>
                    }
                </div>
                : <>
                    {
                        this.state.user1 && this.state.user2
                        ? <SpectatorContainer {...this.state} />
                        : <span>LOADING...</span>
                    }
                </>
                
                
            }
            </>
        );
    }
}

export default withRouter(MatchContainer);