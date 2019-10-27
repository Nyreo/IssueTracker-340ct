import React, {Component} from 'react'

// custom module imports
import Issues from '../../modules/issueHandler'

import IssuesTable from '../issuesTable'

import TableDropDown from '../table-dropdown'

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

        const priorityOptions = [
            {value: 1,label: '1'},
            {value: 2,label: '2'},
            {value: 3,label: '3'},
            {value: 4,label: '4'},
            {value: 5,label: '5'}
        ]

        const statusOptions = [
            {value: 'reported', label:'reported'},
            {value: 'allocated', label:'allocated'},
            {value: 'resolved', label:'resolved'}
        ]

        const issueData = issues.map(issue => {
            return (
            <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.type}</td>
                <td><div className='description'>{issue.description}</div></td>
                <td>{issue.lat.toFixed(2)},{issue.lng.toFixed(2)}</td>
                <td>{issue.streetName ? issue.streetName : '-'}</td>
                <td>{issue.username}</td>
                <td><TableDropDown 
                        initialValue={issue.status}
                        options={statusOptions}
                        id={issue.id}
                        changeCallback={this.setIssueStatus}
                    /></td>
                <td><TableDropDown 
                        initialValue={issue.priority}
                        options={priorityOptions}
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
                        <IssuesTable issues={this.state.issues}/>
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