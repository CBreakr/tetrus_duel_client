import axios from "axios";

// for now...
// const baseURL = "http://localhost:3000";
const baseURL = "https://flatirontetris-server.herokuapp.com/"

// export const webSocketUrl = 'ws://localhost:3000/cable';

export const webSocketUrl = 'wss://XXflatirontetris-server.herokuapp.com/cable';

const handleError = err => console.error(err);

const config = (token) => {
    return {
        headers: {
            Authorization: "Bearer " + token
        }
    };
}

//
// user
// register & login
//

export const ping = (token, callback) => {
    console.log("trigger ping");
    return axios.get(`${baseURL}/users/ping`, config(token))
    .catch((err) => {
        handleError();
        if(callback && typeof callback === "function"){
            callback(err);
        }
    });
}

export const registerUser = (user, callback) => {
    const data = {
        name: user.name,
        password: user.password
    }
    return axios.post(`${baseURL}/users/register`, {user: data})
    .catch((err) => {
        handleError();
        if(callback && typeof callback === "function"){
            callback(err);
        }
    });
}

export const loginUser = (user, callback) => {
    const data = {
        name: user.name,
        password: user.password
    }
    return axios.post(`${baseURL}/users/login`, {user: data})
    .catch((err) => {
        handleError();
        if(callback && typeof callback === "function"){
            callback(err);
        }
    });
}

export const logoutUser = (token) => {
    return axios.post(`${baseURL}/users/logout`, {}, config(token))
    .catch(handleError);
}

export const getUserDetails = (token, user_id) => {
    return axios.get(`${baseURL}/users/${user_id}`, config(token))
    .catch(handleError);
}

export const getAllData = () => {
    return axios.get(`${baseURL}/all`)
    .catch(handleError);
}

export const startSoloGame = (token) => {
    return axios.post(`${baseURL}/games`, {}, config(token))
    .catch(handleError);
}

// export const updateGameState = (token, game) => {
//     return axios.post(`${baseURL}/games/${game.id}`, game, config(token))
//     .catch(handleError);
// }

/*
    get "/users/available", to: "users#available"
    patch "/users/enter_lobby", to: "users#enter_lobby"
    
    get "/matches/active", to: "matches#active"
    post "/matches/issue_challenge", to: "matches#issue_challenge"
    post "/matches/reject_challenge", to: "matches#reject_challenge"
    post "/matches/accept_challenge", to: "matches#accept_challenge"
    patch "/matches/:id", to: "matches#update"
    patch "/matches/:id/concede", to: "matches#concede"
    patch "/matches/:id/match_lost", to: "matches#match_lost"
    patch "/matches/:id/accept_handshake", to: "matches#accept_handshake"
*/

export const getAvailableUsers = (token) => {
    return axios.get(`${baseURL}/users/available`, config(token))
    .catch(handleError);
}

export const enterLobby = (token) => {
    return axios.patch(`${baseURL}/users/enter_lobby`, {}, config(token))
    .catch(handleError);
}

export const getActiveMatches = (token) => {
    return axios.get(`${baseURL}/matches/active`, config(token))
    .catch(handleError);
}

export const issueChallenge = (token, user_being_challenged_id) => {
    return axios.post(`${baseURL}/matches/issue_challenge`, {id: user_being_challenged_id}, config(token))
    .catch(handleError);
}

export const cancelChallenge = (token, user_challenging_id) => {
    return axios.post(`${baseURL}/matches/cancel_challenge`, {id: user_challenging_id}, config(token))
    .catch(handleError);
}

export const rejectChallenge = (token, user_challenging_id) => {
    return axios.post(`${baseURL}/matches/reject_challenge`, {id: user_challenging_id}, config(token))
    .catch(handleError);
}

export const acceptChallenge = (token, user_challenging_id) => {
    return axios.post(`${baseURL}/matches/accept_challenge`, {id: user_challenging_id}, config(token))
    .catch(handleError);
}

export const acceptMatchHandshake = (token, match_id) => {
    return axios.patch(`${baseURL}/matches/${match_id}/accept_handshake`, {}, config(token))
    .catch(handleError);
}

export const updateMatch = (token, match_id, game) => {
    return axios.patch(`${baseURL}/matches/${match_id}`, {game}, config(token))
    .catch(handleError);
}

export const concedeMatch = (token, match_id, game_id) => {
    return axios.patch(`${baseURL}/matches/${match_id}/concede`, {game_id}, config(token))
    .catch(handleError);
}

// export const matchLost = (token, match_id) => {
//     return axios.patch(`${baseURL}/matches/${match_id}/match_lost`, {}, config(token))
//     .catch(handleError);
// }

export const getMatchDetails = (token, path) => {
    return axios.get(`${baseURL}${path}`, config(token))
    .catch(handleError);
}
