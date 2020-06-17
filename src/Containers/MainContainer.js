import React from "react";

import ActiveMatchesContainer from "./ActiveMatchesContainer";
import LobbyContainer from "./LobbyContainer";

import AnimateBackground from "../Components/AnimatedBackground";

class MainContainer extends React.Component {

    // componentDidMount(){
    //     if(!this.context.token){
    //         this.props.history.push("/logout");
    //     }
    // }

    render() {
        return (
            <>
                <AnimateBackground />
                <div className="main-container">
                    <ActiveMatchesContainer />
                    <LobbyContainer />
                </div>
            </>
        )
    }
}

export default MainContainer;