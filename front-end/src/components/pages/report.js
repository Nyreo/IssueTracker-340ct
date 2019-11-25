import React, {Component} from 'react'

import ReportIssueForm from '../forms/reportIssueForm'

export default class ReportIssuePage extends Component {

	componentDidMount() {
		document.title = this.props.title
	}

	render() {
		return (
			<>
				<ReportIssueForm history={this.props.history} store={this.props.store}/>
			</>
		)
	}
}