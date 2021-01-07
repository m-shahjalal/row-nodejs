// dependencies
const data = require('../lib/data')
const { hash, parsedJSON, randomToken } = require('../helpers/utilities')

// module scaffolding
const handler = {}

handler.tokenHandler = (request, callback) => {
	const acceptedMethods = ['get', 'post', 'put', 'delete']
	if (acceptedMethods.indexOf(request.method) > -1) {
		handler._token[request.method](request, callback)
	} else {
		callback(405, { message: 'Invalid method' })
	}
}

handler._token = {}

handler._token.post = (request, callback) => {
	const phone =
		typeof request.body.phone === 'string' &&
		request.body.phone.trim().length === 11
			? request.body.phone
			: false

	const password =
		typeof request.body.password === 'string' &&
		request.body.password.trim().length > 0
			? request.body.password
			: false

	if (phone && password) {
		data.read('users', phone, (err1, userData) => {
			const user = { ...parsedJSON(userData) }
			if (!err1) {
				let hashPassword = hash(password)
				if (hashPassword === user.password) {
					let tokenObject = {}
					tokenObject.id = randomToken(20)
					tokenObject.expires = Date.now() + 60 * 60 * 1000
					tokenObject.phone = phone

					// store the token object
					data.create(
						'tokens',
						tokenObject.id,
						tokenObject,
						(err2) => {
							if (err2) {
								callback(201, tokenObject)
							} else {
								callback(500, {
									message: 'Error occurred while store token',
								})
							}
						}
					)
				} else {
					callback(405, { message: 'Invalid password' })
				}
			} else {
				callback(400, { message: 'You have a problem' })
			}
		})
	} else {
		callback(400, { message: 'You have a problem in your request' })
	}
}

handler._token.get = (request, callback) => {
	const token =
		typeof request.queryObject.id === 'string' &&
		request.queryObject.id.length > 0
			? request.queryObject.id
			: false

	data.read('tokens', token, (err, tokenData) => {
		if (!err && tokenData) {
			const tokenDetails = parsedJSON(tokenData)
			callback(200, tokenDetails)
		} else {
			callback(404, { message: 'Data not found' })
		}
	})
}

handler._token.put = (request, callback) => {
	const token =
		typeof request.body.id === 'string' && request.body.id.length > 0
			? request.body.id
			: false
	const extend =
		typeof request.body.extend === 'boolean' ? request.body.extend : false

	if (token && extend) {
		data.read('tokens', token, (err1, tokenData) => {
			const tokenDetails = parsedJSON(tokenData)
			if (tokenDetails.expires > Date.now()) {
				tokenDetails.expires = Date.now() + 60 * 60 * 1000
				data.update('tokens', token, tokenDetails, (err2) => {
					if (err2) {
						callback(200, { message: 'token update successful' })
					} else {
						callback(500, { message: 'token update failed' })
					}
				})
			} else {
				callback(405, { message: 'token already expired' })
			}
		})
	} else {
		callback(400, { message: 'There is a problem in your request' })
	}
}

handler._token.delete = (request, callback) => {
	const token =
		typeof request.queryObject.id === 'string' &&
		request.queryObject.id.length > 0
			? request.queryObject.id
			: false

	if (token) {
		data.read('tokens', token, (err1, tokenData) => {
			if (!err1 && tokenData) {
				data.delete('tokens', token, (err2) => {
					if (err2) {
						callback(200, { message: 'token delete successful' })
					} else {
						callback(500, { message: 'token delete failed' })
					}
				})
			} else {
				callback(405, { message: 'There is a problem' })
			}
		})
	} else {
		callback(400, { message: 'There is a problem in your request' })
	}
}

handler.verify = (id, phone, callback) => {
	data.read('tokens', id, (error, user) => {
		if ((!error, user)) {
			if (
				parsedJSON(user).phone === phone &&
				parsedJSON(user).expires > Date.now()
			) {
				callback(true)
			} else {
				callback(false)
			}
		} else {
			callback(false)
		}
	})
}

// export handler
module.exports = handler
