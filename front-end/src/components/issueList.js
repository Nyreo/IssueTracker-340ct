import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Icon imports */
import { faList } from '@fortawesome/free-solid-svg-icons'

// component imports
import IssueCard from './issueCard'

const IssueList = ({issues, numIssues, store, toggleMap}) => {

    const renderIssues = () => {
        const issueCards = issues.map((issue,i) => {
            return (
                <IssueCard key={issue.id} store={store} issue={issue}/>
            )
        })

        return issueCards
    }

    return (
        <>
        <p className='panel-header relative'><FontAwesomeIcon icon={faList}/>Issues -
            <span className='link' onClick={toggleMap}> View on Map</span>
            <span className='sub abs-right'>Displaying {numIssues} Issues</span>
        </p>
        {
            issues ? <div className='issue-list'>{renderIssues()}</div> : null
        }
        </>
    )
}

export default IssueList