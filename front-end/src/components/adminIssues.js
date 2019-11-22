// standard imports
import React, {Component} from 'react'

// custom module imports
import IssueHandler from '../modules/issueHandler'
import UserAuth from '../modules/userAuthentication'

// component imports
import IssuesTable from './issuesTable'
import TableDropDown from './table-dropdown'
import IssuesFilter from './issuesFilter'
import AdminPanel from './adminPanel'
import Pagination from './pagination'
import SuggestionBox from './suggestionBox'
import Suggestion from './suggestion'

// utils imports
import {ADMIN_STATUS_OPTIONS, PRIORITY_OPTIONS} from '../utils/constants/issueData'
import DateHandler from '../utils/functional/dateHandler'
import Location from '../utils/functional/location'

class AdminIssues extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            issues : null,
            rawIssues : null,
            numIssues : 0,
            rpp : 15,
            pagination : 0,
            currentFilter : {},
            suggestions : [],
            suggestionRange : 1,
        }
    }

    // fetch all issues when the component is loaded
    componentDidMount = () => {
        this.refreshIssueList()
    }

    compareUserVotes = (a, b) => {
        if(a.votes > b.votes) return -1
        if(a.votes < b.votes) return 1
        return 0
    }

    setIssuePriority = (id, priority) => {
        IssueHandler.updateIssuePriority(id, priority)
            .then(() => this.refreshIssueList())
            .catch(err => console.log(err))
    }

    tableSetIssueStatus = (id, status) => {
        // pseudo function to ensure that suggestions are only made when table status is changed
        this.setIssueStatus(id, status)
        if(status === 'allocated') this.makeIssueSuggestion(id)
        else this.setState({suggestions: []})
    }

    setIssueStatus = (id, status) => {
        // console.log(`id: ${id} status: ${status}`)
        IssueHandler.updateIssueStatus(id, status)
            .then(() => this.refreshIssueList())
            .then(() => {
                const user = this.props.store.getState().userReducer.user.username
                const subject = `Reported Issue Status UPDATE`
                const message = `<p>Issue Ref. #${id} status has been updated to ${status}.
                <a href='localhost:3000/issues'>Click Here</a> to view your updated issues </p>`
                UserAuth.sendEmail({user, subject, message})
            })
            .then(() => this.props.createNotification(`Issue ${id} has been updated to ${status}.`))
            .catch(err => console.log(err))
    }

    filterIssues = (filter) => {
        const filteredIssues = IssueHandler.filterIssues(this.state.rawIssues, filter)
        this.setState({currentFilter:filter, pagination:0, numIssues: filteredIssues.length})
        this.sortByUserVotes(filteredIssues)
    }

    refreshIssueList = () => {
        IssueHandler.fetchAllIssues()
            .then((response) => {
                const rawIssues = response
                this.setState({rawIssues, numIssues : rawIssues.length})
                this.filterIssues(this.state.currentFilter)
            })
            .catch(err => console.log(err))
    }

    sortByUserVotes = (issues) => {
        const sortedIssues = issues.sort(this.compareUserVotes)
        this.renderIssues(sortedIssues)
    }

    // createIssuePopUp = (issue) => {

    //     const dateReported = new Date(issue.dateSubmitted).toLocaleDateString()
    //     const timeElapsed = issue.dateResolved ? issue.dateResolved : Date.now()
    //     const daysElapsed = DateHandler.timestampDays(DateHandler.difference(issue.dateSubmitted, timeElapsed))

    //     const content = (
    //         <ul style={{listStyle: 'none', paddingLeft: '0'}}>
    //             <li><b>Issue Ref.</b> {issue.id}</li>
    //             <li><b>Type</b> {issue.type}</li>
    //             <li><b>Description</b> {issue.description}</li>
    //             <li><b>Vote Count</b> {issue.votes}</li>
    //             <li><b>Date Reported</b> {dateReported}</li>
    //             <li><b>Days Elapsed</b> {daysElapsed}</li>
    //             <li><b>Location</b> [{issue.lat}][{issue.lng}]</li>
    //             <li><b>Street Name</b> {issue.streetName}</li>
    //             <li><b>Reported By</b> {issue.username}</li>
    //         </ul>
    //     )

    //     this.props.createPopUp(content)
    // }

    renderIssues = (issues) => {
        const issueData = issues.map(issue => {

            const description = (<div className='description'>{issue.description}</div>)
            let dateReported = new Date(issue.dateSubmitted)
                dateReported = `${dateReported.getDate()}/${dateReported.getMonth()}/${dateReported.getFullYear()}`
            const timeElapsed = issue.dateResolved ? issue.dateResolved : Date.now()
            const daysElapsed = DateHandler.timestampDays(DateHandler.difference(issue.dateSubmitted, timeElapsed))
            
                
            const location = (`${issue.lat.toFixed(2)},${issue.lng.toFixed(2)}`)
            const streetName = issue.streetName ? issue.streetName : '-'
            
            return (
            <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.type}</td>
                <td>{description}</td>
                <td>{issue.votes}</td>
                <td>{dateReported}</td>
                <td>{daysElapsed}</td>
                <td>{location}</td>
                <td>{streetName}</td>
                <td>{issue.username}</td>
                <td><TableDropDown 
                        initialValue={issue.status}
                        options={ADMIN_STATUS_OPTIONS}
                        id={issue.id}
                        changeCallback={this.tableSetIssueStatus}
                    /></td>
                <td><TableDropDown 
                        initialValue={issue.priority ? issue.priority : undefined}
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

    makeIssueSuggestion = (id) => {
        // fetch issue id
        const target = this.state.rawIssues.filter(issue => issue.id === id)[0]
        // get array of items by distance from selected issue
        const issuesByDistance = this.state.rawIssues.map(issue => {
            const distance = Location.distance(target.lat, target.lng, issue.lat, issue.lng)
            return {...issue, distance}
        })
        // filter out target and issues that are already resolved / allocated
        const filteredIssuesByDistance = issuesByDistance.filter(issue => {
            return (issue.id !== target.id && issue.status === 'reported' && issue.distance <= this.state.suggestionRange)
        })
        if(filteredIssuesByDistance.length > 0) {
            // order by user votes
            const issuesByVotes = filteredIssuesByDistance.sort(this.compareUserVotes)
            this.setState({suggestions: issuesByVotes})
        } else {
            this.setState({suggestions: []})
            alert('There were no suggestions to be made.') // change this (kinda annoying)
        }
        
    }

    suggestionAllocation = (id) => 
    {
        // remove issue from suggestions
        const newSuggestions = this.state.suggestions.filter(issue => {
            return issue.id !== id
        })
        this.setState({suggestions: newSuggestions})
        // update issue status
        this.setIssueStatus(id, 'allocated')
    }


    renderSuggestions = () => {
        // console.log(this.state.suggestions)
        let suggestions = []
        const length = this.state.suggestions.length < 4 ? this.state.suggestions.length : 4
        for(let i = 0; i < length; i++) {
            suggestions.push(
                <Suggestion mostImportant={i === 0}key={`suggestion${i}`} issue={this.state.suggestions[i]} allocateClick={() => this.suggestionAllocation(this.state.suggestions[i].id)}/>)
        }
        return suggestions
    }

    render() {
        return (
            <div>
                {this.state.issues ?
                    <>  
                        {/* <button onClick={() => this.createIssuePopUp(this.state.rawIssues[0])}>Create Popup</button> */}
                        <div className='flex'>
                            <IssuesFilter filterCallback={this.filterIssues} isAdmin={true}/>
                            <AdminPanel/>
                        </div>
                        { this.state.suggestions.length > 0 ? <SuggestionBox suggestions={this.renderSuggestions()}/> : null}
                        <div> 
                            <IssuesTable issues={this.state.issues[this.state.pagination]} numIssues={this.state.numIssues}/>
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