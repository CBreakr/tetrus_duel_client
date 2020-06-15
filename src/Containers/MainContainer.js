import React from "react";

import ActiveMatchesContainer from "./ActiveMatchesContainer";
import LobbyContainer from "./LobbyContainer";

import { withRouter } from "react-router-dom";

import { startSoloGame } from "../requests";

import AuthContext from "../AuthContext";

class MainContainer extends React.Component {

    static contextType = AuthContext;

    playSolo = () => {
        // create a new game on the server
        // return the ID info and use that to redirect

        startSoloGame(this.context.token)
        .then(res => {
            console.log("PLAY SOLO", res);
            this.props.history.push(`/games/${res.data.id}`);
        })
    }

    // componentDidMount(){
    //     if(!this.context.token){
    //         this.props.history.push("/logout");
    //     }
    // }

    render() {
        return (
            <div className="main-container">
                <ActiveMatchesContainer />
                <LobbyContainer />
                <button onClick={this.playSolo}>Play Solo</button>
            </div>
        )
    }
}

export default withRouter(MainContainer);