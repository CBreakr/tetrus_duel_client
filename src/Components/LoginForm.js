import React from "react";

import { loginUser } from "../requests";

class LoginForm extends React.Component {

    state = {
        name: "",
        password: "",
        error: null
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    login = (event) => {
        event.preventDefault();
        // check login
        if (this.state.name && this.state.password) {
            // if correct:
            const user = { ...this.state };
            this.loginUser(user);
        }
        else {
            this.setState({ error: "invalid username/password combination" });
        }
    }

    loginUser = (user) => {
        console.log("LOGIN");
        loginUser(user, (err) => {
            console.log("ERROR LOGGING IN");
            this.setState({ error: "invalid username/password combination" });
        })
            .then(res => {
                if (res) {
                    console.log("LOGIN RES", res);
                    this.props.setCurrentUser(res.data);
                }
            });
    }

    render() {
        return (            
            <div id='box1'>                
                <form onSubmit={this.login}>                    
                    <div className="form-grid">
                        <span className="form-cell">
                            <h2 className='title is-3'>LOG IN</h2>
                        </span>
                        <span></span>

                        <span className="form-cell">
                            <label className='label' htmlFor="login_name">USERNAME</label>
                            <label className='label' htmlFor="login_password">PASSWORD</label>
                        </span>

                        <span className="form-cell">
                            <input className='input is-success' type="text" id="login_name"
                                name="name"
                                value={this.state.name}
                                onChange={this.onChange} />

                            <input className='input is-success' type="password" id="login_password"
                                name="password"
                                value={this.state.password}
                                onChange={this.onChange} />
                        </span>

                        <span></span>
                        <span className="form-cell">
                            <button type="submit">Log in</button>
                        </span>
                    </div>
                    {
                        this.state.error
                            ? <div className="error">{this.state.error}</div>
                            : ""
                    }
                </form>
            </div>
        )
    }
}

export default LoginForm;
