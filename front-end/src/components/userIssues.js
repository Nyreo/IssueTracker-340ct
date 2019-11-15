// standard imports
import React, {Component} from 'react'

// custom module imports
import IssueHandler from '../modules/issueHandler'

// utlls imports
import Location from '../utils/functional/location'

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
            numIssues : 0,
            rpp : 5,
            pagination : 0,
            loadingIssues : true
        }
    }

    componentDidMount = () => {
        IssueHandler.fetchAllIssues()
            .then((response) => {
                const rawIssues = response.filter(issue => issue.status !== 'pending')
                this.setState({rawIssues, numIssues : rawIssues.length})
                this.calcIssueDistance()
            })
            .catch(err => console.log(err))
    }

    renderIssues = (issues) => {
        const splitIssues = IssueHandler.splitIssues(issues, this.state.rpp)
        this.setState({issues:splitIssues})
    }

    filterIssues = (filter) => {
        const filteredIssues = IssueHandler.filterIssues(this.state.rawIssues, filter)
        this.setState({pagination:0})
        this.renderIssues(filteredIssues)
    }

    compareDistance = (a, b) => {
        if(a.distance < b.distance) return -1
        if(a.distance > b.distance) return 1
        return 0
    }

    success = (position) => {
        const coords = position.coords
        const issues = this.state.rawIssues.map(issue => {
            const distance = Location.distance(coords.latitude, coords.longitude, issue.lat, issue.lng)
            return issue = {...issue, distance: distance.toFixed(2)}
        })
        const sortedIssues = issues.sort(this.compareDistance)
        this.setState({rawIssues:sortedIssues})

        this.renderIssues(sortedIssues)
    }

    calcIssueDistance = () => {
        Location.getCurrentLocation(this.success)
    }

    render() {
        return (
            <div>
                {this.state.issues ?
                    <>
                        <IssuesFilter filterCallback={this.filterIssues} isAdmin={false}/>
                        <div>
                            <IssuesList issues={this.state.issues[this.state.pagination]} numIssues={this.state.numIssues}/>
                            <Pagination pagination={this.state.pagination} numberOfPages={this.state.issues.length} setPagination={(p) => {this.setState({pagination:p})}}/>
                        </div>
                    </>
                :
                    <div className='loading-blocked'><span>Loading Issues...</span></div>
                }
            </div>
        )
    }
}

export default UserIssues