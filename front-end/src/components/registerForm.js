import React, {useState} from 'react'
import jwt from 'jsonwebtoken'

import {register} from '../modules/userAuthentication'
import {setUser} from '../actions/userActions'

import InputField from './inputField'

const RegisterForm = ({store, history}) => {

    // react states
    const [registerDetails, setRegisterDetails] = useState({
      fullName : "",
      email : "",
      username : "",
      password : "",
      confirmPassword : "",
      address : "",
      postCode: ""
    })
    const [error, setError] = useState("")
  
    // updates the first name state for input field
    const updateFirstName = (e) => {
      const firstName = e.target.value
      setRegisterDetails({...registerDetails, firstName})
    }

    // updates the last name state for input field
    const updateLastName = (e) => {
      const lastName = e.target.value
      setRegisterDetails({...registerDetails, lastName})
    }

    // updates username state for input field
    const updateUsername = (e) => {
      const username = e.target.value
      setRegisterDetails({...registerDetails, username})
    }
  
    // updates password state for password field
    const updatePassword = (e) => {
      const password = e.target.value
      setRegisterDetails({...registerDetails, password})
    }

    const updateConfirmPassword = (e) => {
      const confirmPassword = e.target.value
      setRegisterDetails({...registerDetails, confirmPassword})
    }
    
    const updateEmail = (e) => {
      const email = e.target.value
      setRegisterDetails({...registerDetails, email})
    }

    const updateAddress = (e) => {
      const address = e.target.value
      setRegisterDetails({...registerDetails, address})
    }

    const updatePostCode = (e) => {
      const postCode = e.target.value
      setRegisterDetails({...registerDetails, postCode})
    }

    


    // form submission for the register form
    const onSubmit = (e) => {
      e.preventDefault()
      
      register(registerDetails.username,registerDetails.password)
        .then(response => {
          
          try {
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
          } catch (err) {
            setError('There was an unexpected error, Please try again.')
          }
            
        })
    }
    
    // visual return of the component
    return (
      <div className='centered'>  
        {error ? <span className='animated shake error centered-margin'>{error}</span> : null}
        <form className='form centered centered-margin' onSubmit={onSubmit}>
          <h1 className='header centered'>REGISTER</h1>

          <div className="input-fields centered-margin">
            <div className="input-double">
              <InputField label={"First Name"}  type={"text"} value={registerDetails.firstName} onChange={updateFirstName}/>
              <InputField label={"Last Name"} type={"text"} value={registerDetails.lastName} onChange={updateLastName}/>
            </div>
            <InputField label={"Email Address"}  type={"text"} value={registerDetails.email} onChange={updateEmail}/>
            <InputField label={"Username"}  type={"text"} value={registerDetails.username} onChange={updateUsername}/>
            <InputField label={"Password"}  type={"password"} value={registerDetails.password} onChange={updatePassword}/>
            <InputField label={"Confirm Password"} placeholder={"Confirm your password"} type={"password"} value={registerDetails.confirmPassword} onChange={updateConfirmPassword}/>
            <div className="input-double">
              <InputField label={"Address"}  type={"text"} value={registerDetails.address} onChange={updateAddress}/>
              <InputField label={"Post Code"} type={"text"} value={registerDetails.postCode} onChange={updatePostCode}/>
            </div>
            <input className="submit-button" type='submit' value='Sign me up!' />
          </div>
          
        </form>
      </div>
    )
  }

export default RegisterForm