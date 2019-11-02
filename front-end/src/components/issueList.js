import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Icon imports */
import { faList } from '@fortawesome/free-solid-svg-icons'

// component imports
import IssueCard from './issueCard'

const IssueList = ({issues}) => {

    const renderIssues = () => {
        const issueCards = issues.map((issue,i) => {
            return (
                <IssueCard key={`issue${i}`} issue={issue}/>
            )
        })

        return issueCards
    }

    return (
        <>
        <p className='panel-header'><FontAwesomeIcon icon={faList}/>Issues</p>
        {
            issues ? <div className='issue-list'>{renderIssues()}</div> : null
        }
        </>
    )
}

export default IssueList