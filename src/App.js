import React from 'react';
import './App.css';

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

import RankDisplay from "./Components/RankDisplay";

class App extends React.Component {

  state = {
    user: null,
    token: null,
    loginMessage: "",
    registerMessage: "",
    loaded: false,
    all: null
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

    }
    else{      
      this.setState({user: null, token: null});
    }
  }

  logout = () => {
    console.log("LOGOUT");
    requests.logoutUser(this.state.token)
    .then(res => {
      this.setCurrentUser(null);
      localStorage.removeItem('__tetris_duel_token_user_id__');
      localStorage.removeItem('__tetris_duel_token_user_name__');
      localStorage.removeItem('__tetris_duel_token_jwt__');
    });
  }

  render(){
    return (
      <AuthContext.Provider value={this.state}>
        {
          this.state.user
          ? <span><RankDisplay {...this.state.user} /> <button onClick={this.logout}>Logout</button></span>
          : ""
        }
        <br />
        <Switch>
            <Route exact path="/">
              {
                !this.state.user
                ? <UserActionContainer setCurrentUser={this.setCurrentUser} />
                : <MainContainer />
              }
            </Route>
            <Route render={() => <WithContainer {...this.state} /> } />
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
                <MatchContainer />
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