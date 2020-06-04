import axios from "axios";

// for now...
const baseURL = "http://localhost:3000";

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

export const logoutUser = () => {
    return axios.post(`${baseURL}/users/logout`, null)
    .catch(handleError);
}

export const getAllData = () => {
    return axios.get(`${baseURL}/all`)
    .catch(handleError);
}