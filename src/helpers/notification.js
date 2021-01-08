// dependencies
const https = require('https')
const queryString = require('querystring')
const environment = require('./environment')

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
		msg.trim().length < 1600
			? msg.trim()
			: false

	if (phone && msg) {
		// configure the twilio payload
		const payload = {
			Form: '+12512205833',
			To: `+88${userPhone}`,
			Body: userMsg,
		}

		// stringify the payload
		const stringifyPayload = queryString.stringify(payload)

		// configure request object
		const requestDetails = {
			hostName: 'api.twilio.com',
			method: 'POST',
			path: `/2010-04-01/Accounts/AC416aab8db44ffd00d7f673d9ab4cef0f/Messages.json`,
			auth: `AC416aab8db44ffd00d7f673d9ab4cef0f:b8e0afe699d770c2a87752029c4da4d3`,
			headers: {
				'Content-Type': 'application/X-www-form-urlencoded',
			},
		}

		// instantiate request
		const req = https.request(requestDetails, (res) => {
			const status = res.statusCode
			if (status === 200 || status === 201) {
				callback(false)
			} else {
				callback(`status code was ${status}`)
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
