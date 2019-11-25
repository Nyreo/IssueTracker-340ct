import React from 'react'

import Fade from 'react-reveal/Fade'

// standard component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// icon imports
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons'

const Notification = ({message}) => {
	return (
		<div className='notification'>
			<Fade bottom>
			<div className='shadow'>
				<FontAwesomeIcon icon={faCheckSquare}/>
				<span>{message}</span>
			</div>
			</Fade>
			
		</div>
		
		
	)
}

export default Notification