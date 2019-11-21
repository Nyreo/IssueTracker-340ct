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
import Map from './map'
import IssuePanel from './issuePanel'

class UserIssues extends Component {
    constructor(props) {
        super(props)
        this.state = {
            issues : null,
            rawIssues : null,
            numIssues : 0,
            rpp : 5,
            pagination : 0,
            loadMessage : 'Loading...',
            userLocation : {},
            mapIssue : {}
        }
    }

    componentDidMount = () => {
        this.setState({loadMessage : 'Fetching issues...'})
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
        this.setState({pagination:0, numIssues:filteredIssues.length})
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
        // console.log(coords)
        this.setState({rawIssues:sortedIssues, userLocation: coords})

        this.renderIssues(sortedIssues)
    }

    calcIssueDistance = () => {
        this.setState({loadMessage : 'Calculating distance from location...'})
        Location.getCurrentLocation(this.success)
    }

    onMapClick = (issue) => {
        this.setState({mapIssue : issue})
    }

    closeIssuePanel = () => {
        this.setState({mapIssue: {}})
    }

    render() {
        return (
            <div>
                {this.state.issues ?
                    <>
                        <div className='flex'>
                            <div className='flex-70 flex-no-shrink anim-all-200'>
                                <Map onMapClick={(issue) => this.onMapClick(issue)} userLocation={[this.state.userLocation.latitude, this.state.userLocation.longitude]} zoom={9} issues={this.state.rawIssues}/>
                            </div>
                            { this.state.mapIssue.id ? 
                                <IssuePanel issue={this.state.mapIssue} close={() => this.closeIssuePanel()}/>
                                :
                                null
                            }
                            
                        </div>
                        
                        <IssuesFilter filterCallback={this.filterIssues} isAdmin={false}/>
                        <div>
                            <IssuesList issues={this.state.issues[this.state.pagination]} numIssues={this.state.numIssues} store={this.props.store}/>
                            <Pagination pagination={this.state.pagination} numberOfPages={this.state.issues.length} setPagination={(p) => {this.setState({pagination:p})}}/>
                        </div>
                    </>
                :
                    <div className='loading-blocked'><span>{this.state.loadMessage}</span></div>
                }
            </div>
        )
    }
}

export default UserIssues