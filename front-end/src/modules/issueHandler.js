// module responsible for handle issue retrieval and submission
import axios from 'axios'

const api_url = 'http://localhost:8080/issues'

export const fetchAllIssues = () => {

    const api_endpoint = `${api_url}/fetch`

    return axios
        .get(api_endpoint)
        .then(response => {
            return response.data
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

// export const deleteIssue = (id) => {
// }

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

export const voteForIssue = (id) => {
    // vote for issue
    const api_endpoint = `${api_url}/vote`
    return axios
        .post(api_endpoint, {id})
        .then(response => {
            return response
        })
        .catch(err => {
            throw err.response
        })
}

export const voteAgainstIssue = (id) => {
    // downvote an issue
    const api_endpoint = `${api_url}/downvote`
    return axios
        .put(api_endpoint, {id})
        .then(response => {
            return response
        })
        .catch(err => {
            throw err.response
        })
}

export const filterIssues = (issues, filter) => {
    
    if(!issues.length) throw new Error('No issues available')

    let filteredIssues = issues

    for(const key of Object.keys(filter)) {
        if(filter[key] !== 'Select...' && Object.keys(issues[0]).indexOf(key) >= 0) {
            filteredIssues = filteredIssues.filter(issue => {
                return (issue[key]).toString() === (filter[key]).toString()
            })
        }
    }
    return filteredIssues
}

export const splitIssues = (issues, rpp=10) => {
    if(!issues) throw new Error('No issues available')
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
    voteForIssue,
    voteAgainstIssue,
    filterIssues,
    splitIssues
}