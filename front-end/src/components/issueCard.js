// standard imports
import React, {useState} from 'react'

// utils imports
import DateHandler from '../utils/functional/dateHandler'

// custom component imports
import VotePanel from './votePanel'

// standard component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// icon imports
import { faCheckCircle, faClock, faFlag} from '@fortawesome/free-solid-svg-icons'

// animation imports
import Fade from 'react-reveal/Fade'

const IssueCard = ({issue, store}) => {

    const [stateIssue, setStateIssue] = useState(issue)

    let dateReported = new Date(stateIssue.dateSubmitted)
        dateReported = `${dateReported.getDate()}/${dateReported.getMonth()}/${dateReported.getFullYear()}`
    const streetName = (stateIssue.streetName ? stateIssue.streetName : 'N/A')
    
    const timeElapsed = stateIssue.dateResolved ? stateIssue.dateResolved : Date.now()
    const daysElapsed = DateHandler.timestampDays(DateHandler.difference(stateIssue.dateSubmitted, timeElapsed))

    let titleStyle;
    let titleIcon;

    switch(issue.status) {
        case 'reported':
            titleStyle = {
                backgroundColor : '#eb6060',
                color: 'whitesmoke'
            }
            titleIcon = faFlag
            break
        case 'allocated':
            titleStyle = {
                backgroundColor : '#f7e463',
                color : '#222222'
            }
            titleIcon = faClock
            break
        case 'resolved':
            titleStyle = {
                backgroundColor : '#7cd992',
                color : 'whitesmoke'
            }
            titleIcon = faCheckCircle
            break
        default:
            break
    }
    
    return (
        <Fade>
            <div key={stateIssue.id} className='issue-card shadow'>
                <div style={titleStyle} className='title'>
                    <FontAwesomeIcon icon={titleIcon}/>
                    <span>#{stateIssue.id} Status: {stateIssue.status} - Votes: {stateIssue.votes}</span>
                </div>
                <ul className='details'>
                    <li>
                        <span className='type'>Description</span>
                        <p>{stateIssue.description}</p>
                    </li>
                    <li>
                        <span className='type'>Type</span>
                        <p>{stateIssue.type}</p>
                    </li>
                    <li>
                        <span className='type'>Date Reported</span>
                        <p>{dateReported}</p>
                        <span className='type'>Time Elapsed</span>
                        <p>{daysElapsed} day(s)</p>
                    </li>
                    <li>
                        <span className='type'>Location</span>
                        <p>Lat: {stateIssue.lat.toFixed(5)}</p>
                        <p>Lng: {stateIssue.lng.toFixed(5)}</p>
                    </li>
                    <li>
                        <span className='type'>Street Name</span>
                        <p>{streetName}</p>
                    </li>
                    <li>
                        <span className='type'>Status</span>
                        <p>{stateIssue.status}</p>
                    </li>
                    <li>
                        <span className='type'>Priority</span>
                        <p>{stateIssue.priority}</p>
                    </li>
                    {
                        stateIssue.distance ? 
                        (
                            <li>
                                <span className='type'>Distance from Current Location</span>
                                <p>{stateIssue.distance} KM</p>
                            </li>
                        ) : null
                    }
                </ul>
                <div className='gap-left inline vote w-100'>
                    {stateIssue.status === 'reported' ?
                        <VotePanel store={store} setStateIssue={setStateIssue} stateIssue={stateIssue}/>
                        :
                        <span>Voting for this issue has been <b>closed.</b></span>
                    }
                </div>
                <div className='inline user'>
                    <em>Issue reported by: {stateIssue.username}</em>
                </div>
            </div>
        </Fade>
        
    )
}

export default IssueCard