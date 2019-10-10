import { combineReducers } from 'redux'

import userReducer from './reducers/userReducer'
import messageReducer from './reducers/messageReducer'

export default combineReducers({
    userReducer,
    messageReducer
})