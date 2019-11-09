// validate package --- written by Joe Mitchell

'use strict'

const validateDate = (date) => {
	if(isNaN(date)) throw new Error('invalid date type')
}

const checkMissingData = (data, requiredKeys) => {
	for(const key of requiredKeys) {
		if(!(key in data)) throw new Error(`${key} missing`)
	}
}

const checkCorrectDataTypes = (data, example) => {
	for(const key of Object.keys(data)) {
		if(typeof data[key] !== typeof example[key]) throw new Error(`${key} has invalid data type`)
	}
}

// const validateTimestamp(timestamp) {
// 	// check for -ve timestamp
// 	if(timestamp < 0) throw new Error('timestamp cannot be negative')
// 	// check for too advanced timestamp
// 	// eslint-disable-next-line no-magic-numbers
// 	const daySeconds = 60*60*24,
// 		advancedTimeStamp = Date.now() + daySeconds
// 	if(timestamp > advancedTimeStamp) throw new Error('timestamp is too far in the future')
// }

const checkUndefinedParams = params => {
	for(const key of Object.keys(params)) {
		if(!params[key] || params[key]==='') throw new Error(`${key} must not be blank`)
	}
}

module.exports = {
	validateDate,
	checkMissingData,
	checkCorrectDataTypes,
	checkUndefinedParams
}
