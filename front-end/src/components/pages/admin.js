import React, {Component} from 'react'

import AdminIssues from '../adminIssues'

import Popup from '../popup'

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

    render () {
        return (
            <>
            {this.state.popupContent ? <Popup content={this.state.popupContent} close={() => this.clearPopUp()}/> : null}
            <div className='fill shadow'>
                <h1>Admin</h1>
                <AdminIssues store={this.props.store} createPopUp={this.createPopUp}/>
            </div>
            </>
        )
    }
}

export default AdminPage