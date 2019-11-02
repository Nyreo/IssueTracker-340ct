/* standard imports */

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import jwt from 'jsonwebtoken'

import App from './App';
import './index.css'

import * as serviceWorker from './serviceWorker';

/* custom imports */
import rootReducer from './utils/rootReducer'
import { setUser } from './actions/userActions'

// create redux store for the combined project reducers & 
//make accessible to redux dev tool
const store = createStore (
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// check for local data storage token -- maybe moev to another file?
if(localStorage.token) {
    // const token_data = jwt.decode(localStorage.token)
    try {
        const token_data = jwt.verify(localStorage.token, 'somekey')
        if((token_data.exp * 1000) <= Date.now()) {
            // token has expired -- requires refresh token
            console.log('token has expired! please login')
            localStorage.removeItem('token')
        } else store.dispatch(setUser(token_data))
    } catch(err) {
        // token has changed
        console.log('token has been changed!')
        localStorage.removeItem('token')
    }
}

const renderApp = () => {
    ReactDOM.render(
        <App store={store}/>,
        document.getElementById('root'));
}
renderApp()
store.subscribe(renderApp)




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
