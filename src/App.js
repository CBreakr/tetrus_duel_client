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

const webSocketUrl = 'ws://localhost:3000/cable';
let socket = null;

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

    this.createNotificationWebsocketConnection();
  }

  dataTest = () => {
    requests.getAllData()
    .then(res => {
      console.log("ALL DATA", res.data);
    })
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  createNotificationWebsocketConnection = () => {    
    // Creates the new websocket connection
    socket = new WebSocket(webSocketUrl);

    /*
    commentSocket.onopen = function(event) {
        console.log('COMMENT WebSocket is connected.', commentSocket);

        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                id: questionId,
                channel: 'QuestionChannel'
            }),
        };

        commentSocket.send(JSON.stringify(msg));
    };
    */

    // When the connection is 1st created, this code runs subscribing the clien to a specific chatroom stream in the ChatRoomChannel
    socket.onopen = function(event) {
        console.log('WebSocket is connected.', socket);

        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                channel: 'DefaultChannel'
            }),
        };

        socket.send(JSON.stringify(msg));
    };
    
    // When the connection is closed, this code is run
    socket.onclose = function(event) {
        console.log('WebSocket is closed.');
        // returnToMainPage();
    };

    // When a message is received through the websocket, this code is run
    socket.onmessage = function(event) {            
        const response = event.data;
        const msg = JSON.parse(response);

        // Ignores pings
        if (msg.type === "ping" || msg.type === "confirm_subscription" || msg.type === "welcome") {
            return;
        } 
        
        // Renders any newly created messages onto the page
        if (msg.message) {
            console.log("from broadcast", msg);
        }
      };
      
      // When an error occurs through the websocket connection, this code is run printing the error message
      socket.onerror = function(error) {
          console.log('WebSocket Error: ', error);
      };
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

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
    requests.logoutUser()
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
          this.state.loaded
          ? <span>loaded</span>
          : <span>NOT loaded</span>
        }
        {
          this.state.user
          ? <span>We have a user {this.state.user.name} <button onClick={this.logout}>Logout</button></span>
          : ""
        }
        <button onClick={this.dataTest}>Test</button>
        <br />
        <br />
        <br />
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
                <MatchContainer />
              </Route>
              <Route path="/matches/:id">
                <span>SPECTATOR VIEW</span>
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