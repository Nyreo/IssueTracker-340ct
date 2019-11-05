import React, {useState} from 'react';

const TableDropDown = ({initialValue, options, changeCallback, id, defaultValue}) => {
    const [value, setValue] = useState((defaultValue ? defaultValue : initialValue))

    const renderOptions = () => {
        if(defaultValue) {
            options = [{value:null, label:'Select...'}].concat(options)
        }

        const renderedOptions = options.map((option,i) => {
            return (
                <option key={`${id}option${i}`} value={option.value}>{option.label}</option>
            )
        })
        return renderedOptions
    }

    const setCurrentValue = (e) => {
        const _value = e.target.value
        setValue(_value)

        if(changeCallback) {
            changeCallback(id, _value)
        }
    }

    return (
        <select className='' value={value} onChange={setCurrentValue}>
            {renderOptions()}
        </select>
    )
}

export default TableDropDown