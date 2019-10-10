// redux reducer function for the user state

const initialState = {
    isAuth : false,
    user : {}
}

export default ( state = initialState, action = {}) => {
    switch(action.type) {
        case 'SET_USER': 
            return {
                isAuth : true,
                user : action.user
            }
        case 'CLEAR_USER':
            return initialState
        default : return state
    }
}