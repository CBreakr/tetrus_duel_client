import React from "react";

import { registerUser } from "../requests";

class SignupForm extends React.Component {

    state = {
        name: "",
        password: "",
        confirmation: "",
        error: null
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    register = (event) => {
        event.preventDefault();
        // check login
        if (this.state.name && this.state.password) {
            if (this.state.password === this.state.confirmation) {
                // if correct:
                // call to register the user

                const user = { ...this.state };
                this.registerUser(user);
            }
            else {
                this.setState({ error: "passwords do not match" });
            }
        }
        else {
            this.setState({ error: "username and password required" });
        }
    }

    registerUser = (user) => {
        console.log("REGISTER");
        registerUser(user, (err) => {
            console.log("ERROR REGISTERING");
            this.setState({ error: "could not register this user" });
        })
            .then(res => {
                if (res) {
                    console.log("REGISTER RES", res);
                    this.props.setCurrentUser(res.data);
                }
            });
    }

    render() {
        return (
            <div id='box2'>                
                <form onSubmit={this.register}>
                    <div className="form-grid">
                        <span></span>
                        <span className="form-cell">
                            <h2 className='title is-3'>SIGN UP</h2>
                        </span>

                        <span className="form-cell">
                            <label className='label' htmlFor="register_name">USERNAME</label>
                            <label className='label' htmlFor="register_password">PASSWORD</label>
                            <label className='label' htmlFor="confirmation">CONFIRM</label>
                        </span>

                        <span className="form-cell">
                            <input className='input is-success' type="text" id="register_name"
                                name="name"
                                value={this.state.name}
                                onChange={this.onChange}
                            />
                            
                            <input className='input is-success' type="password" id="register_password"
                                name="password"
                                value={this.state.password}
                                onChange={this.onChange}
                            />
                            
                            <input className='input is-success' type="password" id="confirmation"
                                name="confirmation"
                                value={this.state.confirmation}
                                onChange={this.onChange}
                            />
                        </span>

                        <span className="form-cell">
                            <button type="submit">Sign Up</button>
                        </span>
                        <span></span>
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

export default SignupForm;
