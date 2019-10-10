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

if(localStorage.token) {
    const user = jwt.decode(localStorage.token)
    store.dispatch(setUser(user))
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
