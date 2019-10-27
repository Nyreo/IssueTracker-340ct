/* standard imports */
import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route, Link, Redirect
} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Icon imports */
import { faHome, faUser, faUserCog } from '@fortawesome/free-solid-svg-icons'

/* Component Imports */

import LoginForm from './components/forms/loginForm'
import RegisterForm from './components/forms/registerForm'
import ReportIssueForm from './components/forms/reportIssueForm'

import Home from './components/home'
import IssuesPage  from './components/issues'
import AdminPage from './components/pages/admin'

/* Custom imports */

import { clearUser } from './actions/userActions'

// main app
function App(props) {

  const userData = props.store.getState().userReducer.user ? props.store.getState().userReducer : {} 

  const logout = () => {
    // reset the redux state and delete localstorage user token
    props.store.dispatch(clearUser())
    localStorage.removeItem('token')
  }
  
  return (
    <div>
      <Router>
      <div className='nav'>
            <div className='fl-left h-centered-margin'>
              <Link className='link' to='/'><FontAwesomeIcon icon={faHome}/>Home</Link>
              {
                userData.isAuth ?
                <>
                  <Link className='link' to='/issues'>Issues</Link>
                  <Link className='link' to='/issues/report'>Report Issue</Link>
                </>
                :
                null
              }
              
            </div>
            <div className='fl-right'>
                {
                  userData.isAuth ? 
                  <>
                    <em className='welcome-message'>Welcome, {userData.user.username}</em>
                    <Link className='link' to='/account'><FontAwesomeIcon icon={faUser}/>Account</Link>
                    {
                      userData.user.isStaff ?
                      <>
                        <Link className='link' to='/admin'><FontAwesomeIcon icon={faUserCog}/>Admin</Link>
                      </>
                      :
                      null
                    }
                    <button className='link' onClick={() => logout()}>Logout</button>
                  </>
                  :
                  <>
                    <Link className='link' to='/register'>Register</Link>
                    <Link className='link' to='/login'>Login</Link>
                  </>
                }
            </div>
            
          </div>
        <div className='container h-centered-margin' >
          
          <Route exact path="/" render={() => <Home userData={userData}/>} />
          
          <Route exact path="/register" render={(compProps) => 
            userData.isAuth ? <Redirect to="/" /> : <RegisterForm {...compProps} store={props.store} />
          } />
          
          <Route exact path="/login" render={(compProps) => 
            userData.isAuth ? <Redirect to="/"/> : <LoginForm {...compProps} store={props.store} />
          } />

          <Route exact path="/issues" render={(compProps) => 
            userData.isAuth ? <IssuesPage {...compProps} store={props.store} /> : <Redirect to="/login"/>
          } />

          <Route exact path="/admin" render={(compProps) => 
            userData.user.isStaff ? <AdminPage {...compProps} store={props.store}/> : <Redirect to="/"/>
          } />

          <Route exact path="/issues/report" render={(compProps) => 
            userData.isAuth ?  <ReportIssueForm {...compProps} store={props.store} /> : <Redirect to="/login"/>
          } />

          <Route exact path="/account" render={(compProps) => 
            userData.isAuth ? <h1>{userData.user.username}'s Account</h1> : <Redirect to="/login"/>
          } />

          
        </div>
      </Router>
    </div>
  );
}

export default App;
