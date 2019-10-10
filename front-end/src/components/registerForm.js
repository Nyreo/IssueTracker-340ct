import React, {useState} from 'react'
import jwt from 'jsonwebtoken'

import {register} from '../modules/userAuthentication'
import {setUser} from '../actions/userActions'

const RegisterForm = ({store, history}) => {

    // react states
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
  
    // updates username state for input field
    const updateUsername = (e) => {
      const _username = e.target.value
      setUsername(_username)
    }
  
    // updates password state for password field
    const updatePassword = (e) => {
      const _password = e.target.value
      setPassword(_password)
    }
    
    // form submission for the register form
    const onSubmit = (e) => {
      e.preventDefault()
      
      register(username,password)
        .then(response => {
            if(!response.data.err) {
              // write token to local storage
              const token = response.data.token
              localStorage.setItem('token', token)
              
              // decode token to user
              const user = jwt.decode(token)
              store.dispatch(setUser(user))

              // redirect to home page once registration is complete
              history.push('/') 

            } else setError(response.data.err)
        })
    }
    
    // visual return of the component
    return (
      <>
      <h1>Register</h1>
      {error ? <h2>{error}</h2> : null}
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input value={username} onChange={updateUsername} />
        {username ? null : <span>Please enter a username</span>}
        <label>Password</label>
        <input value={password} onChange={updatePassword} type='password' />
        <button type='submit'>Register</button>
      </form>
      </>
    )
  }

export default RegisterForm