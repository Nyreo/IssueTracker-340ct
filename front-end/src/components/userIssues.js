// standard imports
import React, {Component} from 'react'

// custom module imports
import IssueHandler from '../modules/issueHandler'

// component imports
import IssuesFilter from './issuesFilter'
import IssuesList from './issueList'
import Pagination from './pagination'


class UserIssues extends Component {
    constructor(props) {
        super(props)
        this.state = {
            issues : null,
            rawIssues : null,
            rpp : 5,
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
        issues = issues.filter(issue => issue.status !== 'pending')

        const splitIssues = IssueHandler.splitIssues(issues, this.state.rpp)
        this.setState({issues:splitIssues})
    }

    filterIssues = (filter) => {
        const filteredIssues = IssueHandler.filterIssues(this.state.rawIssues, filter)
        this.setState({pagination:0})
        this.renderIssues(filteredIssues)
    }

    render() {
        return (
            <div className=''>
                {this.state.issues ?
                    <>
                        <IssuesFilter filterCallback={this.filterIssues} isAdmin={false}/>
                        <div >
                            <IssuesList issues={this.state.issues[this.state.pagination]}/>
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