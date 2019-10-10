/* standard imports */
import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route, Link, Redirect
} from 'react-router-dom'

/* Component Imports */

import LoginForm from './components/loginForm'
import RegisterForm from './components/registerForm'
import Home from './components/home'
import IssuesList  from './components/issues'

/* Custom imports */

import { clearUser } from './actions/userActions'

// main app
function App(props) {

  const userData = props.store.getState().userReducer.user ? props.store.getState().userReducer : {} 

  const logout = () => {
    props.store.dispatch(clearUser())
    localStorage.removeItem('token')
  }

  return (
    <div>
      <Router>
        <div>
          <div>
            <Link to="/">home</Link>
            {userData.isAuth ? 
              <>
              <Link to="/issues">Issues</Link>
              <button onClick={() => logout()}>Logout</button>
              <em>Welcome, {userData.user.username}</em>
              </>
              : 
              <>
                <Link to="/register">register</Link>
                <Link to="/login">login</Link>
              </>
            }
            
          </div>
          <Route exact path="/" render={() => <Home userData={userData}/>} />
          
          <Route exact path="/register" render={(compProps) => 
            userData.isAuth ? <Redirect to="/" /> : <RegisterForm {...compProps} store={props.store} />
          } />
          
          <Route exact path="/login" render={(compProps) => 
            userData.isAuth ? <Redirect to="/"/> : <LoginForm {...compProps} store={props.store} />
          } />

          <Route exact path="/issues" render={(compProps) => 
            userData.isAuth ? <IssuesList {...compProps} store={props} /> : <Redirect to="/login"/>
          } />
        </div>
      </Router>
    </div>
  );
}

export default App;
