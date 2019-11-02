import React from 'react'

const IssueCard = ({issue}) => {

    let dateReported = new Date(issue.dateSubmitted)
        dateReported = `${dateReported.getDate()}/${dateReported.getMonth()}/${dateReported.getFullYear()}`
    const streetName = (issue.streetName ? issue.streetName : 'N/A')

    let titleStyle;

    switch(issue.status) {
        case 'reported':
            titleStyle = {
                backgroundColor : '#eb6060',
                color: 'whitesmoke'
            }
            break
        case 'allocated':
            titleStyle = {
                backgroundColor : '#f7e463',
                color : '#222222'
            }
            break
        case 'resolved':
            titleStyle = {
                backgroundColor : '#7cd992',
                color : 'whitesmoke'
            }
            break
        default:
            break
    }
    
    return (
        <div className='issue-card shadow'>
            <div style={titleStyle} className='title'>
                #{issue.id}     Status - {issue.status}
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
            </ul>
            <em className='user'>Issue reported by: {issue.username}</em>
        </div>
    )
}

export default IssueCard