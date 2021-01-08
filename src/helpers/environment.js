// module scaffolding
const environments = {}

environments.staging = {
	port: 5000,
	name: 'staging',
	secretKey: 'woeioliasl',
	maxChecks: 5,
}

environments.production = {
	port: 8080,
	name: 'production',
	secretKey: 'ancl sflfhn',
	maxChecks: 5,
}

const currentEnvironment =
	typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging'

const environmentToExport =
	typeof environments[currentEnvironment] === 'object'
		? environments[currentEnvironment]
		: environments.staging

// export module
module.exports = environmentToExport
