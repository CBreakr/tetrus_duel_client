import React from "react";

import LoginForm from "../Components/LoginForm";
import SignupForm from "../Components/SignupForm";

import AnimatedBackground from "../Components/AnimatedBackground";

class UserActionContainer extends React.Component {
    render(){
        return (
            <>
                <AnimatedBackground />
                <div className="user-action-container">                
                    <LoginForm setCurrentUser={this.props.setCurrentUser} />          
                    <SignupForm setCurrentUser={this.props.setCurrentUser} />
                </div>
            </>
        )
    }
}

export default UserActionContainer;
