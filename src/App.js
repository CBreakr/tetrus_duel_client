import React from 'react';
import './App.css';

import flatris from './flatris_icon.svg';

import { withRouter } from "react-router-dom";

import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import * as requests from "./requests";

import AuthContext from "./AuthContext";

import UserActionContainer from "./Containers/UserActionContainer";
import MainContainer from './Containers/MainContainer';
import MatchContainer from './Containers/MatchContainer';
import GameBoard from "./Components/GameBoard";

import MainPlayerDisplay from "./Components/MainPlayerDisplay";

import { getUserDetails } from "./requests";

class App extends React.Component {

  state = {
    user: null,
    token: null,
    loginMessage: "",
    registerMessage: "",
    loaded: false,
    all: null,
    fetchUserDetails: this.fetchUserDetails
  }

  componentDidMount(){
    const data = {
      id: parseInt(localStorage.getItem('__tetris_duel_token_user_id__')),
      name: localStorage.getItem('__tetris_duel_token_user_name__'),
      jwt: localStorage.getItem('__tetris_duel_token_jwt__')
    };

    console.log("APP MOUNT url", this.props.location);
    const url = this.props.location.pathname;
    const query = this.props.location.search;
    
    console.log("APP MOUNT LOCAL STORAGE")
    console.log(data);

    if(data.name && data.name !== "null" && data.name !== "undefined" &&
      data.jwt && data.jwt !== "null" && data.jwt !== "undefined" ){
      console.log("we have an existing login");

      requests.ping(data.jwt, () => {
        console.log("Error on ping")
        this.logout();
      })
      .then(res => {
        if(res){
          console.log("set URL")
          this.setCurrentUser(data, () => {
            if (url !== "/"){
              console.log("pathname", url, query);
              this.props.history.push(url+query);
            }
          });
        }
      });
    } else {
      this.logout()
    }

    // this.createNotificationWebsocketConnection();

    // createActiveMatchesWebsocketConnection(this.capture_func);
    // createActivePlayersWebsocketConnection(this.capture_func);
    // createMatchWebsocketConnection(1, this.capture_func);
  }

  setCurrentUser = (data, callback) => {    

    this.setState({loaded: true});

    if(data){
      console.log(data);
      console.log(callback);
      if(callback && typeof callback === "function"){
        this.setState({user: {id: data.id, name: data.name}, token: data.jwt}, callback);
      }
      else{
        this.setState({user: {id: data.id, name: data.name}, token: data.jwt});
      }
      
      localStorage.setItem('__tetris_duel_token_user_id__', data.id);
      localStorage.setItem('__tetris_duel_token_user_name__', data.name);
      localStorage.setItem('__tetris_duel_token_jwt__', data.jwt);

      this.fetchUserDetails();
    }
    else{      
      console.log("SET USER TO NULL");
      this.setState({user: null, token: null});
    }
  }

  logout = () => {
    console.log("LOGOUT");
    requests.logoutUser(this.state.token)
    .then(res => {
      console.log("LOGOUT RESPONSE");
      this.setCurrentUser(null);
      localStorage.removeItem('__tetris_duel_token_user_id__');
      localStorage.removeItem('__tetris_duel_token_user_name__');
      localStorage.removeItem('__tetris_duel_token_jwt__');
    });
  }

  fetchUserDetails = () => {
    console.log("FETCH USER DETAILS");
    if(this.state.user){
      getUserDetails(this.state.token, this.state.user.id)
      .then(res => {
        if(this.state.user){
          console.log("USER DETAILS", res.data);
          this.setState({user: res.data});
        }
      });
    }
  }

  render(){
    return (
      <AuthContext.Provider value={this.state}>
        <div className="nav-bar">
          <div className="main-title">
          FLATIЯON
          <div className="icon">
            <svg version="1.1" id="flatris" 
              xmlns="http://www.w3.org/2000/svg" 
              x="0px" y="0px"
              viewBox="0 0 30 30">
              <rect x="1" y="10" width="5" height="5"/>
              <rect x="7" y="10" width="5" height="5"/>
              <rect x="13" y="10" width="5" height="5"/>
              <rect x="19" y="10" width="5" height="5"/>
              <rect x="3" y="19" width="5" height="5"/>
              <rect x="9" y="19" width="5" height="5"/>
              <rect x="15" y="19" width="5" height="5"/>
              <rect x="21" y="19" width="5" height="5"/>
            </svg>
          </div>
          &nbsp;TETЯIS
          </div>
          {
            this.state.user
            ? <>
                <MainPlayerDisplay />
                <button onClick={this.logout}>Logout</button>
              </>
            : ""
          }
        </div>
        <br />
        <Switch>
            <Route exact path="/">
              {
                !this.state.user
                ? <UserActionContainer setCurrentUser={this.setCurrentUser} />
                : <MainContainer />
              }
            </Route>
            <Route exact path="/logout">
              <UserActionContainer setCurrentUser={this.setCurrentUser} />
            </Route>
            <Route render={() => <WithContainer {...this.state} fetchUserDetails={this.fetchUserDetails} /> } />
          </Switch>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);

const WithContainer = (props) => {
  console.log("WITH CONTAINER PROPS", props);
  return (
    <div className="container grid">
      {
        props.user
        ? <>
            <Switch>
              <Route path="/games/:id">
                <GameBoard solo={true} />
              </Route>
              <Route path="/matches/:id">
                <MatchContainer fetchUserDetails={props.fetchUserDetails} />
              </Route>
              <Route path="/">
                <Redirect to="/" />
              </Route>
            </Switch>
          </>
        : <> 
          <Redirect to="/" />
        </>
      }
    </div>)  
}