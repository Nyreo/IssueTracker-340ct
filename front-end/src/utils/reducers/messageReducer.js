const initialState = {
    errMessage : "",
    notification : ""
}

export default ( state = initialState, action = {}) => {
    switch(action.type) {
        case 'SET_ERROR_MESSAGE': 
            return {
                ...state,
                errMessage : action.errMessage
            }
        case 'SET_NOTIFICATION':
            return {
                ...state,
                notification : action.notification
            }
        case 'CLEAR_ERROR_MESSAGE':
            return {
                ...state,
                errMessage : ""
            }
        case 'CLEAR_NOTIFICATION':
            return {
                ...state,
                notification : ""
            }
        default : return state
    }
}