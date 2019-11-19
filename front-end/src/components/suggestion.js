import React from 'react'

import Fade from 'react-reveal/Fade'

const Suggestion = ({issue, allocateClick}) => {

	const dateReported = new Date(issue.dateSubmitted).toDateString()

	return (
		<Fade>
			<div className='suggestion shadow'>
				<div className='head'>Issue Ref. #{issue.id} - Votes {issue.votes}</div>
				<div className='content'>
					<ul>
						<li><b>Type</b>: {issue.type}</li>
						<li><b>Status</b>: {issue.status}</li>
						<li><b>Date Reported</b>: {dateReported}</li>
						<li><b>Distance</b>: {issue.distance.toFixed(2)}KM</li>
					</ul>
					<button onClick={allocateClick}>Allocate</button>
				</div>
			</div>
		</Fade>
	)
}

export default Suggestion