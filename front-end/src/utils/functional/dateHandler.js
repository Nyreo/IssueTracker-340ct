const validate = require('../../../../validation/validate')

const msPerDay = 1000 * 60 * 60 * 24


const difference = (date1, date2) => {

    validate.checkUndefinedParams({date1, date2})

    validate.validateDate(date1)
    validate.validateDate(date2)

    date1 = new Date(date1)
    date2 = new Date(date2)

    date1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
    date2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())

    return Math.abs(date1 - date2)
}

const timestampDays = (timestamp) => { 

    validate.checkUndefinedParams({timestamp})
    return Math.floor(timestamp / msPerDay) 
}

export default { 
    difference,
    timestampDays
}