// dependencies
const https = require('https')
const queryString = require('querystring')
const { twilio } = require('./environment')

// module scaffolding
const notifications = {}

// send sms to user with twilio api
notifications.sendMessage = (phone, msg, callback) => {
	const userPhone =
		typeof phone === 'string' && phone.trim().length === 11
			? phone.trim()
			: false

	const userMsg =
		typeof msg === 'string' &&
		msg.trim().length > 0 &&
		msg.trim().length <= 1600
			? msg.trim()
			: false

	if (userPhone && userMsg) {
		// configure the twilio payload
		const payload = {
			From: twilio.fromPhone,
			To: `+88${userPhone}`,
			Body: userMsg,
		}

		// stringify the payload
		const stringifyPayload = queryString.stringify(payload)

		// configure request object
		const requestDetails = {
			hostname: 'api.twilio.com',
			method: 'POST',
			path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
			auth: `${twilio.accountSid}:${twilio.accountToken}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}

		// instantiate request
		const req = https.request(requestDetails, (res) => {
			// get the status of the sent request
			const status = res.statusCode
			// callback successfully if the request went through
			if (status === 200 || status === 201) {
				callback('Successful, message was >>>', userMsg)
			} else {
				callback(`Status code returned was ${status}`)
			}
		})

		req.on('error', (err) => {
			callback(err)
		})

		req.write(stringifyPayload)
		req.end()
	} else {
		callback('given parameter is missing or invalid')
	}
}

// exports
module.exports = notifications
