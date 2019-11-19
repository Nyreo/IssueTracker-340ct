import React, {useState} from 'react'

// // standard component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// icon imports
import { faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons'

const SuggestionBox = ({suggestions}) => {

	const [showSuggestions, setShowSuggestions] = useState(true)
	const [suggestionHeight, setSuggestionHeight] = useState('250px')
	const [toggleIcon, setToggleIcon] = useState(faChevronUp)

	const toggleShow = () => {
		setShowSuggestions(!showSuggestions)
		if(showSuggestions) {
			setSuggestionHeight('20px')
			setToggleIcon(faChevronDown)
		} else {
			setSuggestionHeight('250px')
			setToggleIcon(faChevronUp)
		}
	}

	return (
		<div className='suggestion-box' style={{height : suggestionHeight}}>
			<p className='title panel-header'>Issue Suggestions
				<span style={{fontWeight : 'normal'}}> - These issues are <b>recommened</b> based on distance from the last allocated issue and then sorted by number of user votes.</span>
				<FontAwesomeIcon icon={toggleIcon} onClick={() => toggleShow()}/>
			</p>
			{showSuggestions ? suggestions: null}
		</div>
	)
}

export default SuggestionBox