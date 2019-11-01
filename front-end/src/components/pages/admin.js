import React, {Component} from 'react'

// custom module imports
import Issues from '../../modules/issueHandler'

import IssuesTable from '../issuesTable'

import TableDropDown from '../table-dropdown'

// utils imports

import {STATUS_OPTIONS, PRIORITY_OPTIONS} from '../../utils/constants/issueData'

class AdminPage extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            issues: null
        }
    }

    setIssuePriority = (id, priority) => {
        Issues.updateIssuePriority(id, priority)
            .catch(err => {
                console.log(err)
            })
    }

    setIssueStatus = (id, status) => {
        Issues.updateIssueStatus(id, status)
            .then(() => {})
            .catch(err => {
                console.log(err)
            })
    }

    renderIssues = (issues) => {

        const issueData = issues.map(issue => {

            const description = (<div className='description'>{issue.description}</div>)
            let dateReported = new Date(issue.dateSubmitted)
                dateReported = `${dateReported.getDate()}/${dateReported.getMonth()}/${dateReported.getFullYear()}`
            const location = (`${issue.lat.toFixed(2)},${issue.lng.toFixed(2)}`)
            const streetName = issue.streetName ? issue.streetName : '-'
            
            return (
            <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.type}</td>
                <td>{description}</td>
                <td>{dateReported}</td>
                <td>{location}</td>
                <td>{streetName}</td>
                <td>{issue.username}</td>
                <td><TableDropDown 
                        initialValue={issue.status}
                        options={STATUS_OPTIONS}
                        id={issue.id}
                        changeCallback={this.setIssueStatus}
                    /></td>
                <td><TableDropDown 
                        initialValue={issue.priority}
                        options={PRIORITY_OPTIONS}
                        id={issue.id}
                        changeCallback={this.setIssuePriority}
                    />
                </td>
            </tr>)
        })

        this.setState({
            ...this.state,
            issues: issueData
        })
    }

    // fetch all issues when the component is loaded
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
            <h1>Admin</h1>
                <div className='flex'>
                    {this.state.issues ? 
                        <div className='table-container'>
                            <IssuesTable issues={this.state.issues}/>
                        </div>
                    :
                        // replace with table loading animation
                        <p>Loading Issues...</p>
                    }
                    
                </div>
            </>
        )
    }
}

export default AdminPage