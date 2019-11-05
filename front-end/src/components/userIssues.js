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
            rpp : 5,
            pagination : 0,
            loadingIssues : true
        }
    }

    componentDidMount = () => {

        // console.log(Location.distance(52.4082494,-1.5034827, 52.271126,-2.0000023))

        IssueHandler.fetchAllIssues()
            .then((response) => {
                const rawIssues = response
                this.renderIssues(rawIssues)
                this.setState({rawIssues, loadingIssues: false})
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

    sortIssuesByDistance = (issues) => {
        const sortedIssues = issues.sort(this.compareDistance)
        console.log(sortedIssues)
        this.renderIssues(sortedIssues)
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
        this.setState({rawIssues: issues, loadingIssues:false})
        this.sortIssuesByDistance(issues)
        
    }

    calcIssueDistance = () => {
        this.setState({loadingIssues:true})
        Location.getCurrentLocation(this.success)
    }

    render() {
        return (
            <div>
                {this.state.issues ?
                    <>
                        <button className='submit-button' onClick={() => this.calcIssueDistance()}>Distance</button>
                        <div className='flex'>
                            <IssuesFilter filterCallback={this.filterIssues} isAdmin={false}/>
                            <IssuesFilter filterCallback={this.filterIssues} isAdmin={false}/>
                        </div>
                        <div>
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