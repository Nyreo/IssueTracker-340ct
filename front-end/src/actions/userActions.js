export const setUser = user => {
    return {
        type : 'SET_USER',
        user
    }
}

export const clearUser = () => {
    return {
        type : 'CLEAR_USER'
    }
}