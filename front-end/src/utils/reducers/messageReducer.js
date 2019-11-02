const initialState = {
    errMessage : "",
    notification : ""
}

export default ( state = initialState, action) => {
    switch(action.type) {
        case 'SET_ERROR': 
            return {
                ...state,
                errMessage : action.message
            }
        case 'SET_NOTIFICATION':
            return {
                ...state,
                notification : action.message
            }
        case 'CLEAR_ERROR':
            return {
                ...state,
                errMessage : ""
            }
        case 'CLEAR_NOTIFICATION':
            return {
                ...state,
                notification : ""
            }
        case 'CLEAR_ALL':
            return initialState
        default : return state
    }
}