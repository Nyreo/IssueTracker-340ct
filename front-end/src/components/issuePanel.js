import React from 'react'



const IssuePanel = ({issue, close}) => {

	// console.log(issue)

	return (
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
				<li>(Lat,Lng): <ul style={{marginTop:'0'}}>
						<li>{issue.lat}</li>
						<li>{issue.lng}</li>
					</ul></li>
				<li>Reported By: {issue.username}</li>
			</ul>
			<span className='close' onClick={close}>X</span>
		</div>
	)
}

export default IssuePanel