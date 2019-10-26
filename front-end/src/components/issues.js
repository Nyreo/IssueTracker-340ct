// standard module imports
import React, {useState, useEffect} from 'react'

// custom module imports
import Issues from '../modules/issueHandler'

// custom component imports
import IssuesTable from './issuesTable'

const IssuesList = ({store}) => {
    const [issues, setIssues] = useState(null)
    // const [refresh, setRefresh] = useState(false)
    
    const renderIssues = (issues) => {
        const issueData = issues.map(issue => {
            return (<tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.type}</td>
                <td>{issue.description}</td>
                <td>{issue.lat.toFixed(2)},{issue.lng.toFixed(2)}</td>
                <td>{issue.streetName ? issue.streetName : '-'}</td>
                <td>{issue.username}</td>
                <td>{issue.status}</td>
            </tr>)
        })

        setIssues(issueData)
    }

    useEffect(() => {
        // fetch all issues
        Issues.fetchAllIssues()
            .then((response) => {
                const rawIssues = response.data
                renderIssues(rawIssues)
            })
            .catch(err => console.log(err))
    },[])

    return (
        <>
            <h1>Issues</h1>
            <div className='flex'>
                {issues ? 
                    <IssuesTable issues={issues}/>
                :
                    // replace with table loading animation
                    <p>Loading...</p>
                }
                
            </div>
        </>
    )
}

export default IssuesList