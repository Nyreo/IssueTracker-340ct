import React, {Component} from 'react'

import AdminIssues from '../adminIssues'

class AdminPage extends Component {

    render () {
        return (
            <>
                <h1>Admin</h1>
                <AdminIssues />
            </>
        )
    }
}

export default AdminPage