import React from 'react';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ErrorBox = ({message, closeMe}) => {
    
    return (
        <div className='error-box'>
            <div className='icon'>

            </div>
            <div className='info'>
                <p>{message}</p>
                <FontAwesomeIcon className='close-tag' onClick={closeMe} icon={faWindowClose} />
            </div>
        </div>
    )
}

export default ErrorBox;