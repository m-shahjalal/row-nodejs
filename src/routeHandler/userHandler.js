// dependencies
const data = require('../lib/data')
const { hash, parsedJSON } = require('../helpers/utilities')
const { verify } = require('./tokenHandler')
// module scaffolding
const handler = {}

handler.userHandler = (request, callback) => {
	const acceptedMethods = ['get', 'post', 'put', 'delete']
	if (acceptedMethods.indexOf(request.method) > -1) {
		handler._user[request.method](request, callback)
	} else {
		callback(405)
	}
}

handler._user = {}

handler._user.post = (request, callback) => {
	const firstName =
		typeof request.body.firstName === 'string' &&
		request.body.firstName.trim().length > 0
			? request.body.firstName
			: false

	const lastName =
		typeof request.body.lastName === 'string' &&
		request.body.lastName.trim().length > 0
			? request.body.lastName
			: false

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

	const tosAgreement =
		typeof request.body.tosAgreement === 'boolean'
			? request.body.tosAgreement
			: false

	if (firstName && lastName && phone && password && tosAgreement) {
		data.read('users', phone, (error) => {
			if (error) {
				const userObject = {
					firstName,
					lastName,
					phone,
					password: hash(password),
					tosAgreement,
				}

				// store the data
				data.create('users', phone, userObject, (userError) => {
					if (userError) {
						console.log(userObject)
						callback(200, {
							message: 'User was created successfully',
						})
					} else {
						callback(500, { message: 'Could not create user!' })
					}
				})
			} else {
				callback(500, { error: 'there is a error in server' })
			}
		})
	} else {
		callback(400, {
			error: 'There is a problem, check the form and try again',
		})
	}
}

handler._user.get = (request, callback) => {
	const phone =
		typeof request.queryObject.phone === 'string' &&
		request.queryObject.phone.trim().length === 11
			? request.queryObject.phone
			: false

	if (phone) {
		// verify user
		let token =
			typeof request.headerObject.token === 'string'
				? request.headerObject.token
				: false
		verify(token, phone, (tokenId) => {
			if (tokenId) {
				data.read('users', phone, (error, u) => {
					const user = { ...parsedJSON(u) }
					if (!error && user) {
						delete user.password
						callback(200, user)
					} else {
						console.log(phone)
						callback(404, {
							message: 'Requested user was not found',
						})
					}
				})
			} else {
				callback(403, { message: 'user authentication failed' })
			}
		})
	} else {
		callback(404, { message: 'Invalid phone' })
	}
}

handler._user.put = (request, callback) => {
	const firstName =
		typeof request.body.firstName === 'string' &&
		request.body.firstName.trim().length > 0
			? request.body.firstName
			: false

	const lastName =
		typeof request.body.lastName === 'string' &&
		request.body.lastName.trim().length > 0
			? request.body.lastName
			: false

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

	if (phone) {
		if (firstName || lastName || password) {
			// verify user
			let token =
				typeof request.headerObject.token === 'string'
					? request.headerObject.token
					: false
			verify(token, phone, (tokenId) => {
				if (tokenId) {
					data.read('users', phone, (err, d) => {
						const user = { ...parsedJSON(d) }
						if (!err && user) {
							if (firstName) {
								user.firstName = firstName
							}
							if (lastName) {
								user.lastName = lastName
							}
							if (password) {
								user.password = hash(password)
							}

							data.update('users', phone, user, (err2) => {
								if (err2) {
									callback(201, {
										message: 'Update data successfully',
									})
								} else {
									callback(400, {
										message: 'Update data failed',
									})
								}
							})
						}
					})
				} else {
					callback(403, { message: 'user authentication failed' })
				}
			})
		} else {
			callback(400, { message: 'You have a problem with your request' })
		}
	} else {
		callback(400, { message: 'Invalid phone number, please try again!' })
	}
}

handler._user.delete = (request, callback) => {
	const phone =
		typeof request.queryObject.phone === 'string' &&
		request.queryObject.phone.trim().length === 11
			? request.queryObject.phone
			: false

	if (phone) {
		// verify user
		let token =
			typeof request.headerObject.token === 'string'
				? request.headerObject.token
				: false
		verify(token, phone, (tokenId) => {
			if (tokenId) {
				data.read('users', phone, (error, userData) => {
					if (!error && userData) {
						data.delete('users', phone, (err) => {
							if (err) {
								callback(200, {
									message: 'data deleted successfully',
								})
							} else {
								callback(500, {
									message:
										'There was a problem in server side',
								})
							}
						})
					} else {
						callback(500, {
							message: 'There was a problem in server side',
						})
					}
				})
			} else {
				callback(403, { message: 'user authentication failed' })
			}
		})
	} else {
		callback(405, { message: 'Your data is not found' })
	}
}

// export handler
module.exports = handler
