// module responsible for handle issue retrieval and submission
import axios from 'axios'

const api_url = 'http://localhost:8080/issues'

export const fetchAllIssues = () => {

    const api_endpoint = `${api_url}/fetch`

    return axios
        .get(api_endpoint)
        .then(response => {
            return response
        })
        .catch(err => {
            throw err.response
        })
}

export const reportIssue = (issue) => {

    const api_endpoint = `${api_url}/report`

    return axios
        .post(api_endpoint, issue)
        .then(response => {
            return response
        })
        .catch(err => {
            throw err.response 
        })
}

export default {
    fetchAllIssues,
    reportIssue
}