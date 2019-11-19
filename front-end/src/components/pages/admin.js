import React, {Component} from 'react'

import AdminIssues from '../adminIssues'

class AdminPage extends Component {

    // eslint-disable-next-line
    constructor(props) {
        super(props)
    }

    render () {
        return (
            <div className='fill shadow'>
                <h1>Admin</h1>
                <AdminIssues store={this.props.store}/>
            </div>
        )
    }
}

export default AdminPage