// module for handling user authentication requests through api

// standard imports
import axios from 'axios'

const api_url = 'http://localhost:8080/user'

export const register = (userDetails) => {

    const api_endpoint = `${api_url}/register`

    return axios
        .post(api_endpoint, userDetails)
        .then(response => {
            return response
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
            return response
        }).catch(err => {
            throw err.response
        })
}

export default { login, register }