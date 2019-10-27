import React, {useState} from 'react';

const TableDropDown = ({initialValue, options, changeCallback, id}) => {
    const [value, setValue] = useState(initialValue)

    const renderOptions = () => {
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
        <select value={value} onChange={setCurrentValue}>
            {renderOptions()}
        </select>
    )
}

export default TableDropDown