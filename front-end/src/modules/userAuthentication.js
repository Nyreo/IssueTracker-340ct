/* standard imports */
import axios from 'axios'

const api_url = 'http://localhost:8080/user'

export const register = (user,pass) => {

    const api_endpoint = `${api_url}/register`
    const userObject = { user, pass }

    return axios
        .post(api_endpoint, userObject)
        .then(response => {
            return response
        })
        .catch(err => {
            return err
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
        })
        .catch(err => {
            return err
        })
}