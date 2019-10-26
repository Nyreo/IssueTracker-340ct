import React from 'react';

const InputField = (props) => {
    return (
      <div className="row centered-margin">
        <span className="input-label">{props.label}</span>
        <input 
          value = {props.value} 
          onChange={props.onChange} 
          type={props.type} 
          name={props.label} 
          placeholder={props.placeholder ? props.placeholder : `Enter your ${props.label}`}
          />
          
      </div>
    )
  }

export default InputField;