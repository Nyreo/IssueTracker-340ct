// standard imports
import React, {useState} from 'react'
import jwt from 'jsonwebtoken'

// custom imports
import {login} from '../modules/userAuthentication'
import {setUser} from '../actions/userActions'

// component imports
import InputField from './inputField'

// styling imports
import '../App.css'
import 'animate.css'

const LoginForm = ({store, history}) => {

    // react states --- maybe remove the error?
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
  
    // updates the username state for the username input
    const updateUsername = (e) => {
      const _username = e.target.value
      setUsername(_username)
    }
  
    // updates the password state for the password input
    const updatePassword = (e) => {
      const _password = e.target.value
      setPassword(_password)
    }
  
    // handles the login form submission logic
    const onSubmit = (e) => {
      e.preventDefault()
      
      // check the user credentials
      login(username,password)
        .then(response => {
          try {
            // write token to localStorage
            const token = response.data.token
            localStorage.setItem('token', token)
            
            // decode jsonwebtoken provided by server
            const user = jwt.decode(token)
            store.dispatch(setUser(user))

            //redirect to home page
            history.push('/')
          } catch (err) {
            // something internal has gone wrong. likely to be server logging
          }
        })
        .catch(err => {
          // an error occured with the login credentials
          try{
            setError(err.data)
          } catch (err) { 
            // internal server error occured :( check server logs
            setError("Internal Server Error.")
          }
        })
    }
    
    // visual representation of the loginForm component
    return (
      <div className='centered'>
        
      {error ? <span id='errorMsg' className='shake error centered-margin'>{error}</span> : null}
      <form className='form centered centered-margin' onSubmit={onSubmit}>
        
        <h1 className='header centered'>LOGIN</h1>
        <div className="input-fields centered-margin">
          <InputField label={"Username"}  type={"text"} value={username} onChange={updateUsername}/>
          <InputField label={"Password"}  type={"password"} value={password} onChange={updatePassword}/>

          <input className="submit-button" type='submit' value='Log In!' />
        </div>
        
        <a href='/register'>Don't have an account?</a>
        
      </form>

      
      </div>
    )
  }

export default LoginForm