import React, {Component} from 'react'

import AdminIssues from '../adminIssues'

import Popup from '../popup'
import Notification from '../notification'

class AdminPage extends Component {

    // eslint-disable-next-line
    constructor(props) {
        super(props)

        this.state = {
            popupContent : ''
        }
    }

    createPopUp = (content) => {
        this.setState({popupContent:content})
    }

    clearPopUp = () => {
        this.setState({popupContent:''})
    }

    createNotification = (message) => {
        this.setState({notificationMessage : message})
        setTimeout(() => {
            this.setState({notificationMessage: ''})
        }, 3000)
    }

    render () {
        return (
            <>
            {this.state.notificationMessage ? <Notification message={this.state.notificationMessage}/> : null}
            {this.state.popupContent ? <Popup content={this.state.popupContent} close={() => this.clearPopUp()}/> : null}
            <div className='fill shadow'>
                <h1>Admin</h1>
                <AdminIssues store={this.props.store} createPopUp={this.createPopUp} createNotification={this.createNotification}/>
            </div>
            </>
        )
    }
}

export default AdminPage