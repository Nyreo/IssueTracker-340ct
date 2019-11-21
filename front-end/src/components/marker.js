import React from 'react'

// import style
import {markerStyle} from '../markerstyle'

const Marker = ({issue, onClick}) => {

	let backgroundColor;
	switch(issue.status) {
        case 'reported':
            backgroundColor = '#eb6060'
            break
        case 'allocated':
			backgroundColor = '#f7e463'
            break
        case 'resolved':
            backgroundColor = '#7cd992'
            break
        default:
            break
	}
	
	const style={...markerStyle, backgroundColor}

	return (
		<div onClick={onClick} className='shadow' style={style}>
			{issue.id}
		</div>
	)
}
export default Marker