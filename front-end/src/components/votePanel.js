import React from 'react'

// module imports
import {voteForIssue, voteAgainstIssue} from '../modules/issueHandler'

// component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// icon imports
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'


const VotePanel = ({store, stateIssue, setStateIssue})=> {

	const thankyouAlert = () => {
		alert(`Thank you for voting for the issue #${stateIssue.id}!`)
	}

	const failedVoteAlert = () => {
		alert(`Sorry, you cannot vote for issue #${stateIssue.id}... 
If you wish to change your vote, simply vote for the other option.`)
	}

	const forVote = () => {
		voteForIssue(stateIssue.id, store.getState().userReducer.user.username)
			.then((newVotes) => setStateIssue({...stateIssue, votes : newVotes}))
			.then(() => thankyouAlert())
			.catch(() => failedVoteAlert())
    }

    const againstVote = () => {
		voteAgainstIssue(stateIssue.id, store.getState().userReducer.user.username)
			.then((newVotes) => setStateIssue({...stateIssue, votes : newVotes}))	
			.then(() => thankyouAlert())
			.catch(() => failedVoteAlert())
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