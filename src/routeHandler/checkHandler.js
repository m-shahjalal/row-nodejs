// dependencies
const data = require('../lib/data')
const { hash, randomToken, parsedJSON } = require('../helpers/utilities')
const { verify, tokenHandler } = require('./tokenHandler')
const { maxChecks } = require('../helpers/environment')

// module scaffolding
const handler = {}

handler.checkHandler = (request, callback) => {
	const acceptedMethods = ['get', 'post', 'put', 'delete']
	if (acceptedMethods.indexOf(request.method) > -1) {
		handler._check[request.method](request, callback)
	} else {
		callback(405)
	}
}

handler._check = {}

handler._check.post = (request, callback) => {
	// validate inputs
	let protocol =
		typeof request.body.protocol === 'string' &&
		['http', 'https'].indexOf(request.body.protocol) > -1
			? request.body.protocol
			: false

	let url =
		typeof request.body.url === 'string' &&
		request.body.url.trim().length > 0
			? request.body.url
			: false

	let method =
		typeof request.body.method === 'string' &&
		['GET', 'POST', 'PUT', 'DELETE'].indexOf(request.body.method) > -1
			? request.body.method
			: false

	let successCodes =
		typeof request.body.successCodes === 'object' &&
		request.body.successCodes instanceof Array
			? request.body.successCodes
			: false

	let timeOut =
		typeof request.body.timeOut === 'number' &&
		request.body.timeOut % 1 === 0 &&
		request.body.timeOut >= 1 &&
		request.body.timeOut <= 5
			? request.body.timeOut
			: false

	if (protocol && url && method && successCodes && timeOut) {
		const token =
			typeof request.headerObject.token === 'string'
				? request.headerObject.token
				: false

		// look up user phone by reading user token
		data.read('tokens', token, (err1, d) => {
			if (!err1 && d) {
				const userPhone = parsedJSON(d).phone

				data.read('users', userPhone, (err2, u) => {
					if (!err2 && u) {
						verify(token, userPhone, (isValid) => {
							if (isValid) {
								let userObject = parsedJSON(u)
								let userChecks =
									Array.isArray(userObject.checks) &&
									userObject.checks.length < maxChecks
										? userObject.checks
										: []
								if (userChecks) {
									let checkId = randomToken(20)
									let checkObject = {
										id: checkId,
										userPhone,
										protocol,
										url,
										method,
										timeOut,
										successCodes,
									}

									// save to the database
									data.create(
										'checks',
										checkId,
										checkObject,
										(err3) => {
											if (err3) {
												// add check id to the user's object
												userObject.checks = userChecks
												userObject.checks.push(checkId)

												// Save new user data
												data.update(
													'users',
													userPhone,
													userObject,
													(err4) => {
														if (err4) {
															callback(
																200,
																checkObject
															)
														} else {
															callback(500, {
																message:
																	'server side error',
															})
														}
													}
												)
											} else {
												callback(500, {
													message:
														"Can't create new check",
												})
											}
										}
									)
								} else {
									callback(401, {
										message:
											'user has already reached max checks',
									})
								}
							} else {
								callback(403, { message: 'user not found' })
							}
						})
					} else {
						callback(403, { message: 'authentication failed' })
					}
				})
			}
		})
	} else {
		callback(400, { message: 'You have a problem in your inputs' })
	}
}

handler._check.get = (request, callback) => {
	const id =
		typeof request.queryObject.id === 'string' &&
		request.queryObject.id.length > 0
			? request.queryObject.id
			: false
	const token =
		typeof request.headerObject.token === 'string'
			? request.headerObject.token
			: false

	if (id) {
		data.read('checks', id, (err, c) => {
			const checkDetails = parsedJSON(c)
			if (!err && checkDetails) {
				verify(token, checkDetails.userPhone, (isValid) => {
					if (isValid) {
						callback(200, checkDetails)
					} else {
						callback(405, { message: 'Authentication failed' })
					}
				})
			} else {
				callback(500, { message: 'server error' })
			}
		})
	} else {
		callback(400, { message: 'You have a problem in your request' })
	}
}

handler._check.put = (request, callback) => {
	const id =
		typeof request.body.id === 'string' && request.body.id.trim().length > 0
			? request.body.id
			: false

	// validate inputs
	let protocol =
		typeof request.body.protocol === 'string' &&
		['http', 'https'].indexOf(request.body.protocol) > -1
			? request.body.protocol
			: false

	let url =
		typeof request.body.url === 'string' &&
		request.body.url.trim().length > 0
			? request.body.url
			: false

	let method =
		typeof request.body.method === 'string' &&
		['GET', 'POST', 'PUT', 'DELETE'].indexOf(request.body.method) > -1
			? request.body.method
			: false

	let successCodes =
		typeof request.body.successCodes === 'object' &&
		request.body.successCodes instanceof Array
			? request.body.successCodes
			: false

	let timeOut =
		typeof request.body.timeOut === 'number' &&
		request.body.timeOut % 1 === 0 &&
		request.body.timeOut >= 1 &&
		request.body.timeOut <= 5
			? request.body.timeOut
			: false

	if (id) {
		if (protocol || url || method || successCodes || timeOut) {
			data.read('checks', id, (err1, checks) => {
				if (!err1 && checks) {
					const checkDetails = parsedJSON(checks)
					const token =
						typeof request.headerObject.token === 'string'
							? request.headerObject.token
							: false
					verify(token, checkDetails.userPhone, (isValid) => {
						if (isValid) {
							if (protocol) checkDetails.protocol = protocol
							if (url) checkDetails.url = url
							if (method) checkDetails.method = method
							if (successCodes)
								checkDetails.successCodes = successCodes
							if (timeOut) checkDetails.timeOut = timeOut

							// store the check details
							data.update('checks', id, checkDetails, (err3) => {
								if (err3) {
									callback(200, checkDetails)
								} else {
									callback(500, {
										message: 'server side error',
									})
								}
							})
						} else {
							callback(403, { message: 'authentication failed' })
						}
					})
				} else {
					callback(500, {
						message: 'there is a problem in server side',
					})
				}
			})
		} else {
			callback(400, {
				message: 'You must have to provide a field to update',
			})
		}
	} else {
		callback(400, { message: 'invalid request' })
	}
}

handler._check.delete = (request, callback) => {
	const id =
		typeof request.queryObject.id === 'string' &&
		request.queryObject.id.length > 0
			? request.queryObject.id
			: false
	const token =
		typeof request.headerObject.token === 'string'
			? request.headerObject.token
			: false

	if (id) {
		data.read('checks', id, (err, c) => {
			const checkDetails = parsedJSON(c)
			if (!err && checkDetails) {
				verify(token, checkDetails.userPhone, (isValid) => {
					if (isValid) {
						data.delete('checks', id, (err1) => {
							if (err1) {
								data.read(
									'users',
									checkDetails.userPhone,
									(err2, u) => {
										const user = { ...parsedJSON(u) }
										if (!err2 && u) {
											let userChecks =
												typeof user.checks ===
													'object' &&
												user.checks instanceof Array
													? user.checks
													: []
											let checkPosition = userChecks.indexOf(
												id
											)

											if (checkPosition > -1) {
												userChecks.splice(
													checkPosition,
													1
												)
												// update user instance
												user.checks = userChecks
												data.update(
													'users',
													checkDetails.userPhone,
													user,
													(error) => {
														if (!err) {
															callback(200, user)
														} else {
															callback(500, {
																message:
																	'There was server error',
															})
														}
													}
												)
											} else {
												callback(500, {
													message:
														'The checked id that you trying to delete is not found',
												})
											}
										} else {
											callback(400, {
												message: 'User not found',
											})
										}
									}
								)
							} else {
								callback(500, { message: 'server side error' })
							}
						})
					} else {
						callback(405, { message: 'Authentication failed' })
					}
				})
			} else {
				callback(500, { message: 'server error' })
			}
		})
	} else {
		callback(400, { message: 'You have a problem in your request' })
	}
}

// export handler
module.exports = handler
