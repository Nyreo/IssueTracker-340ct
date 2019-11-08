import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Icon imports */
import { faFilter } from '@fortawesome/free-solid-svg-icons'

// component imports
import TableDropDown from './table-dropdown'

// utils imports
import {USER_STATUS_OPTIONS, ADMIN_STATUS_OPTIONS, PRIORITY_OPTIONS} from '../utils/constants/issueData'


const IssuesFilter = ({filterCallback, isAdmin}) => {
    const [filter, setFilter] = useState({})

    const STATUS_OPTIONS = isAdmin ? ADMIN_STATUS_OPTIONS : USER_STATUS_OPTIONS

    const updateFilter = (id, value) => {
        const currentFilter = filter
        currentFilter[id] = value

        setFilter(currentFilter)

        filterCallback(currentFilter)
    }

    const resetFilter = () => {
        setFilter({})
        filterCallback({})
    }

    return (
        <div className='filter-bar h-centered-margin flex-item-50'>
            <p className='panel-header'><FontAwesomeIcon icon={faFilter} />Filter - <span class='link' onClick={() => resetFilter()}>Reset Filter</span></p>
            <div className='filter-container'>
                <div className='item'>
                    <span>Status</span>
                    <TableDropDown
                        options={STATUS_OPTIONS}
                        id={'status'}
                        initialValue={filter.status}
                        changeCallback={updateFilter}
                        defaultValue={true}
                    />
                </div>
                <div className='item'>
                    <span>Priority</span>
                    <TableDropDown 
                        options={PRIORITY_OPTIONS}
                        id={'priority'}
                        initialValue={filter.priority}
                        changeCallback={updateFilter}
                        defaultValue={true}
                    />
                </div>
                {/* <div style={{width:'100%',marginTop:'1em'}}>
                    <button className='submit-button' onClick={() => resetFilter()}>Reset</button>
                </div> */}
            </div>
        </div>
    )
}

export default IssuesFilter