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

export const updateIssuePriority = (id, priority) => {

    const api_endpoint = `${api_url}/update/priority/${id}`

    return axios
        .put(api_endpoint, {priority})
        .then(response => {
            return response
        })
        .catch(err => {
            throw err.response
        })
}

// export const updateIssueStatus = (id, status) => {

//     const api_endpoint = `${api_url}/update/status/${id}`

//     return axios
//         .put(api_endpoint, {status})
//         .then(response => {
//             return response
//         })
//         .catch(err => {
//             throw err.response
//         })
// }


export default {
    fetchAllIssues,
    reportIssue,
    updateIssuePriority
}