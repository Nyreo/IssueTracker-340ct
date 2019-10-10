/* standard imports */

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import jwt from 'jsonwebtoken'

import * as serviceWorker from './serviceWorker';

import App from './App';
import './index.css'



/* custom imports */
import rootReducer from './utils/rootReducer'
import { setUser } from './actions/userActions'


const store = createStore (
    rootReducer
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
