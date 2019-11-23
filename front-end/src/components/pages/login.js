import React, {Component} from 'react'

import LoginForm from '../forms/loginForm'

export default class LoginPage extends Component {

	componentDidMount() {
		document.title = this.props.title
	}

	render() {
		return (
			<>
				<LoginForm history={this.props.history} store={this.props.store}/>
			</>
		)
	}
}