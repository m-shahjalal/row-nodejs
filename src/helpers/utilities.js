// dependencies
const crypto = require('crypto')
const environment = require('./environment')

// module scaffoldings
const utilities = {}

// parsed JSON
utilities.parsedJSON = (str) => {
	let output
	try {
		output = JSON.parse(str)
	} catch (error) {
		output = {}
	}
	return output
}

// hash string
utilities.hash = (str) => {
	if (typeof str === 'string' && str.length > 0) {
		const hash = crypto
			.createHmac('sha256', environment.secretKey)
			.update(str)
			.digest('hex')
		return hash
	}
}

// token generator
utilities.randomToken = (tokenLength) => {
	const length = typeof tokenLength === 'number' ? tokenLength : false
	if (length) {
		let possibleCharacters =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		let output = ''

		for (let i = 0; i < length; i++) {
			let chr = possibleCharacters.charAt(
				Math.floor(Math.random() * possibleCharacters.length + 1)
			)
			output += chr
		}
		return output
	} else {
		return 'please give a number to the parameter'
	}
}

// export modules
module.exports = utilities
