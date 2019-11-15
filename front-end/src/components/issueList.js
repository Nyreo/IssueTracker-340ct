import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Icon imports */
import { faList } from '@fortawesome/free-solid-svg-icons'

// component imports
import IssueCard from './issueCard'

const IssueList = ({issues, numIssues}) => {

    const renderIssues = () => {
        // console.log('issuesList: ', issues)
        const issueCards = issues.map((issue,i) => {
            return (
                <IssueCard key={`issue${i}`} issue={issue}/>
            )
        })

        return issueCards
    }

    return (
        <>
        <p className='panel-header relative'><FontAwesomeIcon icon={faList}/>Issues
            <span className='sub abs-right'>Displaying {numIssues} Issues</span>
        </p>
        {
            issues ? <div className='issue-list'>{renderIssues()}</div> : null
        }
        </>
    )
}

export default IssueList