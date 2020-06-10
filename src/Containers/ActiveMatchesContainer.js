import React from "react";

import createActiveMatchesWebsocketConnection from "../ActiveMatchesSocket";

import { getActiveMatches } from "../requests";

import AuthContext from "../AuthContext";

import GameMatchupContainer from "./GameMatchupContainer";

class ActiveMatchesContainer extends React.Component {

    state = {
        matches: []
    }

    static contextType = AuthContext;

    componentDidMount(){
        // get the currently active matches
        // set up the subscription to the ActiveMatchChannel

        getActiveMatches(this.context.token)
        .then(res => {
            this.setState({
                matches: res.data
            }, 
            () => createActiveMatchesWebsocketConnection(this.capture_func))
        });
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
        const copy = [];

        this.state.matches.forEach(match => {
            if(match.id !== match_id){
                copy.push(match);
            }
        });

        this.setState({matches: copy});
    }

    render() {
        return (
            <div className="active-matches-container">
                <h3>Active Matches</h3>
                {
                    this.state.matches && this.state.matches.map(match => {
                        return (
                            <GameMatchupContainer 
                                key={match.id}
                                {...match}
                            />
                        )
                    })
                }
            </div>
        );
    }
}

export default ActiveMatchesContainer;