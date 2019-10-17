export const setError = message => {
    return {
        type : 'SET_ERROR',
        message
    }
}

export const clearError = () => {
    return {
        type : 'CLEAR_ERROR'
    }
}

export const setNotification = message => {
    return {
        type: 'SET_NOTIFICATION',
        message
    }
}

export const clearNotification = () => {
    return {
        type: 'CLEAR_NOTIFICATION'
    }
}

export const clearAll = () => {
    return {
        type: 'CLEAR_ALL'
    }
}