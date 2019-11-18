// standard module imports
import React, {Component} from 'react'

import UserIssues from '../userIssues'

class IssuesPage extends Component {
    
    render () {
        return (
            <div className='fill gap-bot shadow'>
                <h1>Reported Issues</h1>
                <UserIssues store={this.props.store}/>
            </div>
        )
    }
    
}

export default IssuesPage