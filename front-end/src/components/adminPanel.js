import React from 'react'

import { saveAs } from 'file-saver'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchJobSheet } from '../modules/issueHandler'

/* Icon imports */
import { faCogs } from '@fortawesome/free-solid-svg-icons'

const AdminPanel = (props) => {

	const fetchJobList = () => {
		fetchJobSheet()
			.then((response) => new Blob([response.data], {type: 'application/pdf'}))
			.then((blob) => saveAs(blob, 'joblist.pdf'))
			.catch((response) => console.log(response))
	}

	return (
		<div className='flex-30'>
			<p className='panel-header'><FontAwesomeIcon icon={faCogs}/>Admin Panel</p>
			<span>Generate a list of jobs that have been allocated and require resolution.</span>
			<button onClick={() => fetchJobList()} className='btn gap-top'>Generate Job Sheet</button>
		</div>
	)
}

export default AdminPanel