// module scaffolding
const environments = {}

environments.staging = {
	port: 443,
	name: 'staging',
	secretKey: 'woeioliasl',
	maxChecks: 5,
	twilio: {
		fromPhone: '+12512205833',
		accountSid: 'AC416aab8db44ffd00d7f673d9ab4cef0f',
		accountToken: 'b8e0afe699d770c2a87752029c4da4d3',
	},
}

environments.production = {
	port: 8080,
	name: 'production',
	secretKey: 'ancl sflfhn',
	maxChecks: 5,
	twilio: {
		fromPhone: '+12512205833',
		accountSid: 'AC416aab8db44ffd00d7f673d9ab4cef0f',
		accountToken: 'b8e0afe699d770c2a87752029c4da4d3',
	},
}

const currentEnvironment =
	typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging'

const environmentToExport =
	typeof environments[currentEnvironment] === 'object'
		? environments[currentEnvironment]
		: environments.staging

// export module
module.exports = environmentToExport
