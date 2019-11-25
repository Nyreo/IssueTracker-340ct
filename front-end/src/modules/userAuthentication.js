// module for handling user authentication requests through api

// standard imports
import axios from 'axios'

let api_url = process.env.REACT_APP_API_URL || 'https://mitch137-test-api.herokuapp.com'
    api_url = `${api_url}/user`
export const register = (userDetails) => {

    const api_endpoint = `${api_url}/register`

    return axios
        .post(api_endpoint, userDetails)
        .then(response => {
            return response.data.token
        })
        .catch(err => {
            throw err.response
        })
}  

export const login = async (user, pass) => {
    
    const api_endpoint = `${api_url}/login`
    const userObject = {
        user,
        pass
    }

    return axios
        .post(api_endpoint, userObject)
        .then(response => {
            return response.data.token
        }).catch(err => {
            throw err.response
        })
}

export const sendEmail = async (details) => {
    const api_endpoint = `${api_url}/message`
    return axios   
        .post(api_endpoint, details)
        .then(response => {
            return response
        })
        .catch(err => {
            throw err.response
        })
}

export default { login, register, sendEmail}