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
        <div className='filter-bar h-centered-margin'>
            <p className='panel-header'><FontAwesomeIcon icon={faFilter} />Filter</p>
            <div className='filter-container'>
                <div className='item'>
                    <span>Status</span>
                    <TableDropDown 
                        options={STATUS_OPTIONS}
                        id={'status'}
                        initialValue={STATUS_OPTIONS[0].value}
                        changeCallback={updateFilter}
                        defaultValue={true}
                    />
                </div>
                <div className='item'>
                    <span>Priority</span>
                    <TableDropDown 
                        options={PRIORITY_OPTIONS}
                        id={'priority'}
                        initialValue={PRIORITY_OPTIONS[0].value}
                        changeCallback={updateFilter}
                        defaultValue={true}
                    />
                </div>
                <div style={{width:'100%',marginTop:'1em'}}>
                    <button onClick={() => resetFilter()}>Reset</button>
                </div>
               
            </div>
            
            {/* <table className='filter-table'>
                <tbody>
                    <tr className='filter-option'>
                    <td>Status</td>
                    <td><TableDropDown 
                        options={STATUS_OPTIONS}
                        id={'status'}
                        initialValue={STATUS_OPTIONS[0].value}
                        changeCallback={updateFilter}
                        defaultValue={true}
                    /></td>
                    </tr>
                    <tr className='filter-option'>
                        <td>Priority</td>
                        <td><TableDropDown 
                        options={PRIORITY_OPTIONS}
                        id={'priority'}
                        initialValue={PRIORITY_OPTIONS[0].value}
                        changeCallback={updateFilter}
                        defaultValue={true}
                    /></td>
                    </tr>
                    <tr>
                        <td>
                            <button>Reset Filter</button>
                        </td>
                    </tr>
                </tbody>
            </table> */}
        </div>
    )
}

export default IssuesFilter