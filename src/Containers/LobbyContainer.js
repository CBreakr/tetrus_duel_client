import React from "react";

import createActivePlayersWebsocketConnection from "../ActivePlayersSocket";
import { getAvailableUsers } from "../requests";
import PlayerDisplay from "../Components/PlayerDisplay";

import AuthContext from "../AuthContext";

class LobbyContainer extends React.Component {

    state = {
        players: []
    }

    static contextType = AuthContext;

    componentDidMount(){
        // get the currently active players
        // set up the subscription to the ActivePlayerChannel

        getAvailableUsers(this.context.token)
        .then(res => {
            console.log("available users", res);
            this.setState({players: res.data}, 
                () => createActivePlayersWebsocketConnection(this.capture_func)
            )
        });
    }

    /*
    ActionCable.server.broadcast "ActivePlayerChannel", {type: "remove", users: [current_user.id, params[:second_user_id]]}
    ActionCable.server.broadcast "ActivePlayersChannel", {type: "challenge", message: {challenger: current_user, challenged: params[:id]}}
    ActionCable.server.broadcast "ActivePlayersChannel", {type: "reject", message: {challenger: current_user, challenged: params[:id]}}
    ActionCable.server.broadcast "ActivePlayersChannel", {type: "enter_lobby", message: cu}
    */

    capture_func = (socket_message) => {
        console.log("captured", socket_message);
        switch(socket_message.type){
            case "enter_lobby":
                this.addPlayerToLobby(socket_message.player);
                break;
            case "challenge":
                break;
            case "reject":
                break;
            case "remove":
                this.removePlayersFromLobby(socket_message.users);
                break;
        }
    }

    addPlayerToLobby = (player) => {
        console.log("add player to lobby", player);
        this.setState({players: [...this.state.players, player]});
    }

    removePlayersFromLobby = (player_ids) => {
        console.log("remove players from lobby", player_ids);
        const copy = [];
        console.log("this.state.players", this.state.players);
        this.state.players && this.state.players.forEach(player => {
            if(!player_ids.includes(player.id)){
                copy.push(player);
            }
        });
        this.setState({players: copy});
    }

    markPlayerUnavailable = (player) => {

    }

    markPlayerInactive = (player) => {

    }

    render(){

        console.log("players render", this.state.players);

        return (
            <div>
                {this.state.players && this.state.players.map(player => {
                    if(player.id !== this.context.user.id){
                        return <PlayerDisplay key={player.id} {...player} />
                    }
                    return null;
                })}
            </div>
        );
    }
}

export default LobbyContainer;