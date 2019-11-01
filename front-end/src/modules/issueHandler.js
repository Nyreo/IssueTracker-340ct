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

export const deleteIssue = (id) => {
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

export const updateIssueStatus = (id, status) => {

    const api_endpoint = `${api_url}/update/status/${id}`

    return axios
        .put(api_endpoint, {status})
        .then(response => {
            return response
        })
        .catch(err => {
            throw err.response
        })
}

export const filterIssues = (issues, filter) => {
    let filteredIssues = issues

    for(const key of Object.keys(filter)) {
        if(filter[key] !== 'Select...') {
            filteredIssues = filteredIssues.filter(issue => {
                return (issue[key]).toString() === (filter[key]).toString()
            })
        }
    }
    return filteredIssues
}

export const splitIssues = (issues, rpp) => {
    let splitIssues = [];

    for(let i = 0; i <= issues.length; i+=rpp) {
        let temp = issues.slice(i, i+rpp)
        splitIssues.push(temp)
    }

    return splitIssues
}


export default {
    fetchAllIssues,
    reportIssue,
    updateIssuePriority,
    updateIssueStatus,
    filterIssues,
    splitIssues
}