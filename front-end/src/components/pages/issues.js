// standard module imports
import React, {Component} from 'react'

// custom module imports
import Issues from '../../modules/issueHandler'

// custom component imports
import IssuesTable from '../issuesTable'
import IssuesFilter from '../issuesFilter'

import Pagination from '../pagination'

class IssuesPage extends Component {
    
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
        Issues.fetchAllIssues()
            .then((response) => {
                const rawIssues = response.data
                this.renderIssues(rawIssues)
                this.setState({rawIssues})
            })
            .catch(err => console.log(err))
    }

    splitIssues(issues) {
        let splitIssues = [];

        for(let i = 0; i <= issues.length; i+=this.state.rpp) {
            let temp = issues.slice(i, i+this.state.rpp)
            splitIssues.push(temp)
        }

        this.setState({issues:splitIssues})
    }

    renderIssues = (issues) => {
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

        this.splitIssues(issueData)
    }

    filterIssues = (filter) => {
        console.log('filter: ',filter)

        let filteredIssues = this.state.rawIssues

        for(const key of Object.keys(filter)) {
            if(filter[key] !== 'Select...') {
                filteredIssues = filteredIssues.filter(issue => {
                    return (issue[key]).toString() === (filter[key]).toString()
                })
            }
        }
        
        this.renderIssues(filteredIssues)
        
    }

    resetIssues = () => {
        this.renderIssues(this.state.rawIssues)
    }

    render() {
        return (
            <>
                <h1>Issues</h1>
                <div className='flex fill-container'>
                    <IssuesFilter filterCallback={this.filterIssues}/>
                    {this.state.issues ?
                        <div className='table-container'> 
                            <IssuesTable issues={this.state.issues[this.state.pagination]}/>
                            <Pagination pagination={this.state.pagination} numberOfPages={this.state.issues.length} setPagination={(p) => {this.setState({pagination:p})}}/>
                        </div>
                    :
                        <p>Loading Issues   ...</p>
                    }
                    
                </div>
            </>
        )
    }
    
}

export default IssuesPage