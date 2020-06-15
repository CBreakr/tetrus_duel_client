import React from "react";

import LoginForm from "../Components/LoginForm";
import SignupForm from "../Components/SignupForm";

class UserActionContainer extends React.Component {
    render(){
        return (
            <div className="user-action-container">                
                <LoginForm setCurrentUser={this.props.setCurrentUser} />          
                <SignupForm setCurrentUser={this.props.setCurrentUser} />
            </div>
        )
    }
}

export default UserActionContainer;
