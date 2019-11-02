// standard module imports
import React, {Component} from 'react'

import UserIssues from '../userIssues'

class IssuesPage extends Component {
    
    render () {
        return (
            <>
                <h1>Reported Issues</h1>
                <UserIssues/>
            </>
        )
    }
    
}

export default IssuesPage