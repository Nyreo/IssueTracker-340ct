import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Icon imports */
import { faTable } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '@material-ui/core/Tooltip'

const IssuesTable = ({issues, numIssues}) => {

    return (
        <>
            <p className='panel-header relative'><FontAwesomeIcon icon={faTable}/>
                Issues
                <span className='sub abs-right'>Found {numIssues} results</span>
            </p>
            <div className='table-container yscroll'>
                <table className='table'>
                <thead>
                    <tr>
                        <th>
                            <Tooltip placement='top' title='Unique value provided as a reference key for the issue.'>
                                <span>Issue Ref.</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='Category the issue falls under.'>
                                <span>Type</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='Description of the issue provided by the user.'>
                                <span>Description</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='The date the issue was reported.'>
                                <span>Date Reported</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='Time Elapsed since the issue was reported or resolved.'>
                                <span>Time Elapsed (days)</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='Latitude and Longitude coordinates of the issue.'>
                                <span>Location (Lat,Lng)</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='Name of the (closest) street at the provided location.'>
                                <span>Street Name</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='Name of the user who reported the issue.'>
                                <span>Reported By</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='Current status of the issue.'>
                                <span>Status</span>
                            </Tooltip>
                        </th>
                        <th>
                            <Tooltip placement='top' title='Priority assigned to the issue by staff. 0 Priority represents priority for that issue has not been assigned.'>
                                <span>Priority</span>
                            </Tooltip>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {issues}
                </tbody>
                </table>
            </div>
        </>
    )
}

export default IssuesTable