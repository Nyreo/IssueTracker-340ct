import React from 'react'

const Marker = ({issue, onClick}) => {

	let backgroundColor;
	let color = 'white';

	switch(issue.status) {
        case 'reported':
            backgroundColor = '#eb6060'
            break
        case 'allocated':
			backgroundColor = '#f7e463'
			color = '#222222'
            break
        case 'resolved':
            backgroundColor = '#7cd992'
            break
        default:
            break
	}

	const style = {backgroundColor, color}

	return (
		<div onClick={onClick} className='pin' style={style}>
			{issue.id}
		</div>
	)
}
export default Marker