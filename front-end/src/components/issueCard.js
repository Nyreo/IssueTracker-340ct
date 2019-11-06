// standard imports
import React from 'react'

// utils imports
import DateHandler from '../utils/functional/dateHandler'

// component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// icon imports
import { faCheckCircle, faClock, faFlag } from '@fortawesome/free-solid-svg-icons'

const IssueCard = ({issue}) => {

    let dateReported = new Date(issue.dateSubmitted)
        dateReported = `${dateReported.getDate()}/${dateReported.getMonth()}/${dateReported.getFullYear()}`
    const streetName = (issue.streetName ? issue.streetName : 'N/A')
    
    const timeElapsed = issue.dateResolved ? issue.dateResolved : Date.now()
    const daysElapsed = DateHandler.timestampDays(DateHandler.difference(issue.dateSubmitted, timeElapsed))

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
        <div className='issue-card shadow'>
            <div style={titleStyle} className='title'>
                <FontAwesomeIcon icon={titleIcon}/>
                <span>#{issue.id} Status - {issue.status}</span>
            </div>
            <ul className='details'>
                <li>
                    <span className='type'>Description</span>
                    <p>{issue.description}</p>
                </li>
                <li>
                    <span className='type'>Type</span>
                    <p>{issue.type}</p>
                </li>
                <li>
                    <span className='type'>Date Reported</span>
                    <p>{dateReported}</p>
                    <span className='type'>Time Elapsed</span>
                    <p>{daysElapsed} day(s)</p>
                </li>
                <li>
                    <span className='type'>Location</span>
                    <p>Lat: {issue.lat.toFixed(5)}</p>
                    <p>Lng: {issue.lng.toFixed(5)}</p>
                </li>
                <li>
                    <span className='type'>Street Name</span>
                    <p>{streetName}</p>
                </li>
                <li>
                    <span className='type'>Status</span>
                    <p>{issue.status}</p>
                </li>
                <li>
                    <span className='type'>Priority</span>
                    <p>{issue.priority}</p>
                </li>
                {
                    issue.distance ? 
                    (
                        <li>
                            <span className='type'>Distance from Current Location</span>
                            <p>{issue.distance} KM</p>
                        </li>
                    ) : null
                }
            </ul>
            <em className='user'>Issue reported by: {issue.username}</em>
        </div>
    )
}

export default IssueCard