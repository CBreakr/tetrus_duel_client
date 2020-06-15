import React from "react";

import createActiveMatchesWebsocketConnection from "../ActiveMatchesSocket";

import { getActiveMatches } from "../requests";

import AuthContext from "../AuthContext";

import GameMatchupContainer from "./GameMatchupContainer";

class ActiveMatchesContainer extends React.Component {

    state = {
        matches: [],
        closeSocket: null
    }

    static contextType = AuthContext;

    componentDidMount(){
        // get the currently active matches
        // set up the subscription to the ActiveMatchChannel

        console.log("ACTIVE MATCHES DID MOUNT");

        getActiveMatches(this.context.token)
        .then(res => { 
            let data = [];

            if(res){
                data = res.data
            }

            console.log("loaded active matches from the DB", data);
            this.setState({
                matches: data
            }, 
            () => {
                const closeSocket = createActiveMatchesWebsocketConnection(this.capture_func);
                this.setState({closeSocket});
            })
        });
    }

    componentWillUnmount(){
        console.log("UNMOUNT active matches");
        if(this.state.closeSocket){
            console.log("do we have the close function?");
            this.state.closeSocket();
        }
    }

    /*
    ActionCable.server.broadcast "ActiveMatchesChannel", {type: "match_created", match: match}
    ActionCable.server.broadcast "ActiveMatchesChannel", {type: "match_ended", match: match}
    */
    capture_func = (socket_message) => {
        console.log("ACTIVE MATCHES socket message", socket_message);
        switch(socket_message.type){
            case "match_created":
                this.addMatch(socket_message.match);
                break;
            case "match_ended":
                this.removeMatch(socket_message.match_id);
                break;
        }
    }

    addMatch = (match) => {
        this.setState({matches: [...this.state.matches, match]});
    }

    removeMatch = (match_id) => {
        console.log("remove match:", match_id);
        console.log("all matches", this.state.matches);
        const copy = [];

        this.state.matches.forEach(match => {
            console.log("match check", match.id, match_id);
            if(match.match_id !== match_id){
                copy.push(match);
            }
        });

        this.setState({matches: copy});
    }

    render() {
        return (
            <>
            {
                this.state.matches && this.state.matches.length > 0
                ? <div className="active-matches-container">
                    <h3>Active Matches</h3>
                    <div className="active-matches-list">
                        {
                            this.state.matches.map(match => {
                                return (
                                    <GameMatchupContainer 
                                        key={match.id}
                                        {...match}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                : ""
            }
            </>
        );
    }
}

export default ActiveMatchesContainer;