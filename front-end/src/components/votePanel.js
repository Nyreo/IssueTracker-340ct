import React from 'react'

// module imports
import {voteForIssue, voteAgainstIssue} from '../modules/issueHandler'

// component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// icon imports
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'


const VotePanel = ({id, store})=> {
	const forVote = () => {
		voteForIssue(id, store.getState().userReducer.user.username)
			.then(() => alert('Thank you for voting!'))
			.catch(() => console.log('internal server error'))
    }

    const againstVote = () => {
		voteAgainstIssue(id, store.getState().userReducer.user.username)
			.then(() => alert('Thank you for voting!'))
			.catch(() => console.log('internal server error'))
	}
	
	return (
		<>
			<span>Think this issue is <b>important?</b> Vote for it!</span>
			<div className='gap-left inline'>
				<button onClick={() => forVote()} className='upvote'><FontAwesomeIcon icon={faArrowUp}/></button>
				<button onClick={() => againstVote()} className='downvote'><FontAwesomeIcon icon={faArrowDown}/></button>
			</div>
		</>
	)

}

export default VotePanel