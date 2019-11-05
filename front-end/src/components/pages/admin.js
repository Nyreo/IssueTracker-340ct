import React, {Component} from 'react'

import AdminIssues from '../adminIssues'

class AdminPage extends Component {

    render () {
        return (
            <div className='fill shadow'>
                <h1>Admin</h1>
                <AdminIssues />
            </div>
        )
    }
}

export default AdminPage