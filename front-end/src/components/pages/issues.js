// standard module imports
import React, {Component} from 'react'

import Issues from '../userIssues'

class IssuesPage extends Component {
    
    render () {
        return (
            <>
                <h1>Reported Issues</h1>
                <Issues/>
            </>
        )
    }
    
}

export default IssuesPage