import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Icon imports */
import { faFilter } from '@fortawesome/free-solid-svg-icons'

// component imports
import TableDropDown from './table-dropdown'

// utils imports
import {STATUS_OPTIONS, PRIORITY_OPTIONS} from '../utils/constants/issueData'


const IssuesFilter = ({filterCallback}) => {
    const [filter, setFilter] = useState({})

    const updateFilter = (id, value) => {
        const currentFilter = filter
        currentFilter[id] = value

        setFilter(currentFilter)

        filterCallback(currentFilter)
    }

    return (
        <div className='filter-bar h-centered-margin'>
            <p className='panel-header'><FontAwesomeIcon icon={faFilter} />Filter</p>
            <div className='filter-list'>
                <div className='filter-option'>
                    <span>Status:</span>
                    <TableDropDown 
                        options={STATUS_OPTIONS}
                        id={'status'}
                        initialValue={STATUS_OPTIONS[0].value}
                        changeCallback={updateFilter}
                        defaultValue={true}
                    />
                </div>
                <div className='filter-option'>
                    <span>Priority:</span>
                    <TableDropDown 
                        options={PRIORITY_OPTIONS}
                        id={'priority'}
                        initialValue={PRIORITY_OPTIONS[0].value}
                        changeCallback={updateFilter}
                        defaultValue={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default IssuesFilter