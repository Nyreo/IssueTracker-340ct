import React, {useState} from 'react'
import jwt from 'jsonwebtoken'
import '../App.css'
import '../animate.css'

import {login} from '../modules/userAuthentication'
import {setUser} from '../actions/userActions'

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
      
      login(username,password)
        .then(response => {
          console.log(response)
            if(!response.data.err) {
                // write token to localStorage
                const token = response.data.token
                localStorage.setItem('token', token)
                
                // decode jsonwebtoken provided by server
                const user = jwt.decode(token)
                store.dispatch(setUser(user))

                //redirect to home page
                history.push('/')

            } else setError(response.data.err)
        })
    }
    
    // visual representation of the loginForm component
    return (
      <div className='centered'>
        
      {error ? <span className='animated shake error centered-margin'>{error}</span> : null}
      <form className='form centered centered-margin' onSubmit={onSubmit}>
        
        <h1 className='header centered'>Login</h1>
        <div className='input'>
          <label>Username</label>
          <input value={username} onChange={updateUsername} />
          {username ? null : <span className='input-warning'>(*) Please enter a username</span>}
        </div>
        <div className='input'>
          <label>Password</label>
          <input value={password} onChange={updatePassword} type='password' />
          {password ? null : <span className='input-warning'>(*) Please enter a password</span>}
        </div>
        
        <button type='submit'>Login</button>
      </form>
      </div>
    )
  }

export default LoginForm