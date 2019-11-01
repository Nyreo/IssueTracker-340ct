// standard imports
import React, {Component} from 'react'

// custom module imports
import IssueHandler from '../modules/issueHandler'

// component imports
import IssuesTable from './issuesTable'
import IssuesFilter from './issuesFilter'

import Pagination from './pagination'

class UserIssues extends Component {
    constructor(props) {
        super(props)
        this.state = {
            issues : null,
            rawIssues : null,
            rpp : 15,
            pagination : 0
        }
    }

    componentDidMount = () => {
        IssueHandler.fetchAllIssues()
            .then((response) => {
                const rawIssues = response.data
                this.renderIssues(rawIssues)
                this.setState({rawIssues})
            })
            .catch(err => console.log(err))
    }

    renderIssues = (issues) => {
        // filter pending issues --- TODO: move to api?
        issues = issues.filter(issue => issue.status !== 'pending')

        const issueData = issues.map(issue => {
            const description = (<div className='description'>{issue.description}</div>)
            let dateReported = new Date(issue.dateSubmitted)
                dateReported = `${dateReported.getDate()}/${dateReported.getMonth()}/${dateReported.getFullYear()}`
            const location = (`${issue.lat.toFixed(2)},${issue.lng.toFixed(2)}`)
            const streetName = issue.streetName ? issue.streetName : '-'
            const priority = issue.priority === 0 ? '-' : issue.priority

            return (
            <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.type}</td>
                <td>{description}</td>
                <td>{dateReported}</td>
                <td>{location}</td>
                <td>{streetName}</td>
                <td>{issue.username}</td>
                <td>{issue.status}</td>
                <td>{priority}</td>
            </tr>)
        })

        const splitIssues = IssueHandler.splitIssues(issueData, this.state.rpp)
        this.setState({issues:splitIssues})
    }

    filterIssues = (filter) => {
        const filteredIssues = IssueHandler.filterIssues(this.state.rawIssues, filter)
        this.renderIssues(filteredIssues)
    }

    resetIssues = () => {
        this.renderIssues(this.state.rawIssues)
    }

    render() {
        return (
            <div className='flex fill-container'>
                {this.state.issues ?
                    <>
                    <IssuesFilter filterCallback={this.filterIssues} isAdmin={false}/>
                    <div className='table-container'> 
                        <IssuesTable issues={this.state.issues[this.state.pagination]}/>
                        <Pagination pagination={this.state.pagination} numberOfPages={this.state.issues.length} setPagination={(p) => {this.setState({pagination:p})}}/>
                    </div>
                    </>
                :
                    <p>Loading Issues   ...</p>
                }
            </div>
        )
    }
}

export default UserIssues