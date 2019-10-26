import React from 'react'

const IssuesTable = ({issues}) => {

    return (
        <table className='table'>
        <thead>
            <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Location (Lat/Lng)</th>
                <th>Street Name</th>
                <th>User</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {issues}
        </tbody>

        <tbody>

        </tbody>
        </table>
    )
}

export default IssuesTable