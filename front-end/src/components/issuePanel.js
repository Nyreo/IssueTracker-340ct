import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Icon imports */
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import Fade from 'react-reveal/Fade'

const IssuePanel = ({issue, close}) => {

	// console.log(issue)

	return (
		<Fade>
			<div className='issue-panel flex-25 border-box padding-10 shadow gap-left anim-all-200'>
			<h1>Issue Details</h1>
			<ul>
				<li>Ref. No: {issue.id}</li>
				<li>Community Votes: {issue.votes}</li>
				<li>Status: {issue.status}</li>
				<li>Priority: {issue.priority}</li>
				<li>Status: {issue.status}</li>
				<li>Description: {issue.description}</li>
				<li>Date Reported: {issue.dateSubmitted}</li>
				<li>Distance from you: {issue.distance}KM</li>
				<li>Coordinates: <ul style={{marginTop:'1em'}}>
						<li>[LAT] {issue.lat}</li>
						<li>[LNG] {issue.lng}</li>
					</ul></li>
				<li>Reported By: {issue.username}</li>
			</ul>
			<span className='close' onClick={close}><FontAwesomeIcon icon={faTimesCircle}/></span>
		</div>
		</Fade>
		
	)
}

export default IssuePanel