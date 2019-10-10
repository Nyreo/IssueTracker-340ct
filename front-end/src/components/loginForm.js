import React, {useState} from 'react'
import jwt from 'jsonwebtoken'

import {login} from '../modules/userAuthentication'
import {setUser} from '../actions/userActions'

const LoginForm = ({store, history}) => {

    // react states
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
                const token = response.data.token
                localStorage.setItem('token', token)
                
                const user = jwt.decode(token)
                store.dispatch(setUser(user))

                //redirect
                history.push('/')

            } else setError(response.data.err)
        })
    }

    console.log(error)
    
    // visual representation of the loginForm component
    return (
      <>
      <h1>Login</h1>
      {error ? <h2>{error}</h2> : null}
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input value={username} onChange={updateUsername} />
        <label>Password</label>
        <input value={password} onChange={updatePassword} type='password' />
        <button type='submit'>Login</button>
      </form>
      </>
    )
  }

export default LoginForm