import React from 'react'

const Popup = ({content, close}) => {
	return (
		<>
			<div className='loading-blocked'></div>
			<div className='popup shadow'>
				{content}
				<span className='close link' onClick={close}>Close</span>
			</div>
		</>
	)
}

export default Popup