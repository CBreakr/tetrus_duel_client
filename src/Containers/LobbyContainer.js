import React from "react";

import createActivePlayersWebsocketConnection from "../ActivePlayersSocket";

import { 
        getAvailableUsers, 
        issueChallenge, 
        acceptChallenge, 
        rejectChallenge, 
        cancelChallenge
    } from "../requests";

import PlayerDisplay from "../Components/PlayerDisplay";
import RankDisplay from "../Components/RankDisplay";

import { withRouter } from "react-router-dom";

import AuthContext from "../AuthContext";

const CHALLENGE_TIME_IN_SECS = 60;

class LobbyContainer extends React.Component {

    state = {
        players: [],
        challenges: [],
        challenge_issued_id: null,
        challenges_issued_by: [],
        challenge_accepted: false,
        closeSocket: null
    }

    static contextType = AuthContext;

    componentDidMount(){
        // get the currently active players
        // set up the subscription to the ActivePlayerChannel

        getAvailableUsers(this.context.token)
        .then(res => {
            console.log("available users", res);
            this.setState({players: res.data}, 
                () => {
                    const closeSocket = createActivePlayersWebsocketConnection(this.capture_func);
                    this.setState({closeSocket});
                }
            )
        });
    }

    componentWillUnmount(){
        console.log("UNMOUNT Lobby");
        if(this.state.closeSocket){
            console.log("do we have the close function?");
            this.state.closeSocket();
        }
    }

    /*
    ActionCable.server.broadcast "ActivePlayerChannel", {type: "remove", users: [current_user.id, params[:second_user_id]]}
    ActionCable.server.broadcast "ActivePlayersChannel", {type: "challenge", message: {challenger: current_user, challenged: params[:id]}}
    ActionCable.server.broadcast "ActivePlayersChannel", {type: "reject", message: {challenger: current_user, challenged: params[:id]}}
    ActionCable.server.broadcast "ActivePlayersChannel", {type: "enter_lobby", message: cu}
    */

    capture_func = (socket_message) => {
        console.log("captured", socket_message, socket_message.type);
        switch(socket_message.type){
            case "enter_lobby":
                this.addPlayerToLobby(socket_message.player);
                break;
            case "challenge":
                console.log("challenge detail: ", socket_message.details);
                this.addChallenge(socket_message.details);
                break;
            case "reject":
                console.log("reject");
                this.removeChallenge(socket_message.details.challenger);
                break;
            case "cancel":
                console.log("cancel");
                this.removeChallenge(socket_message.details.challenger);
                break;
            case "accept":
                this.processChallengeAcceptance(socket_message.users, socket_message.match_id);
                break;
            case "remove":
                this.removePlayersFromLobby(socket_message.users);
                break;
        }
        console.log("after switch");
    }

    addPlayerToLobby = (player) => {
        console.log("add player to lobby", player);
        let found = false;
        
        const copy = this.state.players.map(p => {
            if(player.id === p.id){
                found = true;
                return player;
            }
            else{
                return p;
            }
        });
        
        !found && copy.push(player);

        this.setState({players: copy});
    }

    removePlayersFromLobby = (player_ids) => {
        console.log("remove players from lobby", player_ids);
        const copy = [];
        console.log("this.state.players", this.state.players);
        this.state.players && this.state.players.forEach(player => {
            if(!player_ids.includes(player.id)){
                copy.push(player);
            }
        });
        this.removeChallengeByPlayers(player_ids);
        this.setState({players: copy});
    }

    addChallenge = (details) => {
        console.log("DETAILS", details)
        // {challenger: current_user, challenged: params[:id]}
        console.log(this.context.user.id, details.challenged);
        if(this.context.user.id === details.challenged){
            details.challenger.time = CHALLENGE_TIME_IN_SECS;
            this.setState({challenges: [...this.state.challenges, details.challenger]}, ()=> {
                notifyUser(`Challenge from ${details.challenger.name}`);
            });

            let newTime = CHALLENGE_TIME_IN_SECS;

            console.log("!!!set timeout to reject!!!");
            const timer = setInterval(() => {
                console.log("COUNTDOWN", details.challenger.id, newTime);

                newTime--;

                if(newTime <= 0){
                    // try it out with 10 seconds anyway
                    this.triggerRejectChallenge(details.challenger.id, true);
                    clearInterval(timer);
                }
                else{
                    // update the state
                    const copyChallenges = this.state.challenges.map(challenge => {
                        const copyC = {...challenge};
                        if(copyC.id === details.challenger.id){
                            copyC.time = newTime;
                        }
                        return copyC;
                    });
                    // console.log(copyChallenges);
                    this.setState({challenges: copyChallenges});
                }
            }, 1000);
        }

        // also mark that a challenge has been issued
        this.setState({challenges_issued_by: [...this.state.challenges_issued_by, details.challenger.id]});
    }

    removeChallengeByPlayers = (player_ids) => {
        console.log("STATE CHALLENGES", player_ids, this.state.challenges);
        this.removeChallenge(player_ids);
    }

    removeChallenge = (player_ids) => {

        let ids = player_ids;

        console.log("remove challenge", ids);

        if(!Array.isArray(ids)){
            ids = [ids];
        }

        // remove from the list of challenges_issued_by
        // remove from the list of challenges
        // if matches the current user, remove challenge_issued_id
        const issued_by_copy = [];
        const challenge_copy = [];
        let issued_id = this.state.challenge_issued_id;

        this.state.challenges_issued_by.forEach(by_id => {
            if(!ids.includes(by_id)){
                issued_by_copy.push(by_id);
            }
        });

        this.state.challenges.forEach(challenge => {
            if(!ids.includes(challenge.id)){
                challenge_copy.push(challenge);
            }
        });

        if(ids.includes(this.context.user.id)){
            issued_id = null;
        }

        this.setState({
            challenges_issued_by: issued_by_copy,
            challenges: challenge_copy,
            challenge_issued_id: issued_id
        });
    }

    processChallengeAcceptance = (players, match_id) => {
        // if one of the users matches the current user
        // then redirect them to the correct match page
        console.log("process acceptance", players, match_id)
        if(players.includes(this.context.user.id)){
            notifyUser("Challenge Accepted!");
            this.props.history.push(`/matches/${match_id}`);
        }
    }

    //
    //
    //

    triggerIssueChallenge = (id) => {
        console.log("create challenge", id);
        issueChallenge(this.context.token, id);
        this.setState({challenge_issued_id: id});
    }

    triggerRejectChallenge = (id, isAuto = false) => {
        const challenges_copy = [];
        this.state.challenges.forEach(challenge => {
            if(challenge.id !== id){
                challenges_copy.push(challenge);
            }
        });
        this.setState({challenges: challenges_copy});
        
        console.log("reject", id, isAuto);

        rejectChallenge(this.context.token, id, isAuto);
    }

    triggerCancelChallenge = (id) => {
        console.log("cancel challenge", id);
        this.setState({challenge_issued_id: null});
        cancelChallenge(this.context.token, id);
    }

    triggerAcceptChallenge = (id) => {
        // just have to wait for the redirect
        console.log("accept", id);
        acceptChallenge(this.context.token, id);
    }

    //
    //
    //
    render(){

        console.log("players render", this.state.players);
        console.log("challenges render", this.state.challenges_issued_by);

        return ( 
            <div className="lobby-wrapper">
                <div className="lobby-container">
                    <div className="active-players-container">
                        <h3>
                            AVAILABLE PLAYERS
                            {
                                !this.state.players || this.state.players.length === 1
                                ? <span> (NONE)</span>
                                : ""
                            }
                        </h3>
                        {
                            this.state.players && this.state.players.length > 1
                            ? <div className="active-players-list">
                                {this.state.players.map(player => {
                                    if(player.id !== this.context.user.id){
                                        return (
                                            <PlayerDisplay key={player.id} 
                                                {...player} /* this has the player's issued_challenege value */
                                                createChallenge={this.triggerIssueChallenge}                                 
                                                cancelChallenge={this.triggerCancelChallenge}
                                                challenge_issued_id={this.state.challenge_issued_id} 
                                                challenges_issued_by={this.state.challenges_issued_by}
                                            />
                                        )
                                    }
                                    return null;
                                })}
                            </div>
                            : ""
                        }                
                    </div>
                    <div className="challenges-container">
                            <h3>
                                CHALLENGES
                                {
                                    this.state.challenges.length === 0
                                    ? <span> (NONE)</span>
                                    : ""
                                }
                            </h3>
                            {
                                this.state.challenges.length > 0
                                ? 
                                    <div className="challenges-list">
                                        {
                                            this.state.challenges.map(challenger => {
                                                return (
                                                    <div key={challenger.id} className="challenge-container">
                                                        <div className="challenge">
                                                            <RankDisplay {...challenger} />
                                                            <button onClick={() => this.triggerAcceptChallenge(challenger.id)}>Accept</button>
                                                            <button onClick={() => this.triggerRejectChallenge(challenger.id)}>Reject</button>
                                                        </div>
                                                        <div>Time Remaining: <span className="challenge-countdown">{challenger.time}</span></div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                : ""
                            }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LobbyContainer);

//
//
//
function notifyUser(notice) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        // alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(`Flatiron Tetris! ${notice}`);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(`Flatiron Tetris! ${notice}`);
            }
        });
    }
}