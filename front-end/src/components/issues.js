// standard module imports
import React, {Component} from 'react'

// custom module imports
import Issues from '../modules/issueHandler'

// custom component imports
import IssuesTable from './issuesTable'

class IssuesPage extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            issues : null,
        }
    }

    renderIssues = (issues) => {
        const issueData = issues.map(issue => {
            return (
            <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.type}</td>
                <td><div className='description'>{issue.description}</div></td>
                <td>{issue.lat.toFixed(2)},{issue.lng.toFixed(2)}</td>
                <td>{issue.streetName ? issue.streetName : '-'}</td>
                <td>{issue.username}</td>
                <td>{issue.status}</td>
                <td>{issue.priority === 0 ? '-' : issue.priority}</td>
            </tr>)
        })

        this.setState({
            ...this.state,
            issues: issueData
        })
    }

    componentDidMount = () => {
        Issues.fetchAllIssues()
            .then((response) => {
                const rawIssues = response.data
                this.renderIssues(rawIssues)
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <>
                <h1>Issues</h1>
                <div className='flex'>
                    {this.state.issues ? 
                        <IssuesTable issues={this.state.issues} isAdmin={false}/>
                    :
                        // replace with table loading animation
                        <p>Loading Issues...</p>
                    }
                    
                </div>
            </>
        )
    }
    
}

export default IssuesPage