import React, {Component} from 'react'

import RegisterForm from '../forms/registerForm'

export default class RegsiterForm extends Component {

	componentDidMount() {
		document.title = this.props.title
	}

	render() {
		return (
			<>
				<RegisterForm history={this.props.history} store={this.props.store}/>
			</>
		)
	}
}