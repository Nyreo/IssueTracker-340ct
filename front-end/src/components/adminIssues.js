// standard imports
import React, {Component} from 'react'

// custom module imports
import IssueHandler from '../modules/issueHandler'

// component imports
import IssuesTable from './issuesTable'
import TableDropDown from './table-dropdown'
import IssuesFilter from './issuesFilter'
import Pagination from './pagination'

// utils imports
import {ADMIN_STATUS_OPTIONS, PRIORITY_OPTIONS} from '../utils/constants/issueData'
import DateHandler from '../utils/functional/dateHandler'

class AdminIssues extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            issues : null,
            rawIssues : null,
            rpp : 15,
            pagination : 0,
            currentFilter : {}
        }
    }

    // fetch all issues when the component is loaded
    componentDidMount = () => {
        this.refreshIssueList()
    }

    setIssuePriority = (id, priority) => {
        IssueHandler.updateIssuePriority(id, priority)
            .then(() => this.refreshIssueList())
            .catch(err => console.log(err))
    }

    setIssueStatus = (id, status) => {
        IssueHandler.updateIssueStatus(id, status)
            .then(() => this.refreshIssueList())
            .catch(err => console.log(err))
    }

    filterIssues = (filter) => {
        const filteredIssues = IssueHandler.filterIssues(this.state.rawIssues, filter)
        this.setState({currentFilter:filter, pagination:0})
        this.renderIssues(filteredIssues)
    }

    refreshIssueList = () => {
        IssueHandler.fetchAllIssues()
            .then((response) => {
                const rawIssues = response
                this.setState({rawIssues})
                this.filterIssues(this.state.currentFilter)
            })
            .catch(err => console.log(err))
    }

    renderIssues = (issues) => {
        const issueData = issues.map(issue => {

            const description = (<div className='description'>{issue.description}</div>)
            let dateReported = new Date(issue.dateSubmitted)
                dateReported = `${dateReported.getDate()}/${dateReported.getMonth()}/${dateReported.getFullYear()}`
            const timeElapsed = (issue.timeElapsed ? issue.timeElapsed : DateHandler.timestampDays(DateHandler.difference(Date.now(), issue.dateSubmitted)))    
            const location = (`${issue.lat.toFixed(2)},${issue.lng.toFixed(2)}`)
            const streetName = issue.streetName ? issue.streetName : '-'
            
            return (
            <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.type}</td>
                <td>{description}</td>
                <td>{dateReported}</td>
                <td>{timeElapsed}</td>
                <td>{location}</td>
                <td>{streetName}</td>
                <td>{issue.username}</td>
                <td><TableDropDown 
                        initialValue={issue.status}
                        options={ADMIN_STATUS_OPTIONS}
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

        // seperate issues into chunks
        const splitIssues = IssueHandler.splitIssues(issueData, this.state.rpp)
        this.setState({issues:splitIssues})
    }

    

    render() {
        return (
            <div>
                {this.state.issues ?
                    <>
                        <IssuesFilter filterCallback={this.filterIssues} isAdmin={true}/>
                        <div> 
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

export default AdminIssues