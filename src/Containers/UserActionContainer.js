import React from "react";

import LoginForm from "../Components/LoginForm";
import SignupForm from "../Components/SignupForm";

class UserActionContainer extends React.Component {
    render(){
        return (
            <>
            <div>
                <div className="main-title">Tetris</div>
                <div className="user-action-container">
                    <LoginForm setCurrentUser={this.props.setCurrentUser} />          
                        {/* <div className='border-line'></div>
                    */}
                    <SignupForm setCurrentUser={this.props.setCurrentUser} />
                </div>
            </div>
            </>
        )
    }
}

export default UserActionContainer;
