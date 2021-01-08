// dependencies
const { checkHandler } = require('./routeHandler/checkHandler')
const { sampleHandler } = require('./routeHandler/sampleHandler')
const { tokenHandler } = require('./routeHandler/tokenHandler')
const { userHandler } = require('./routeHandler/userHandler')

// module scaffolding
const routes = {
	sample: sampleHandler,
	user: userHandler,
	token: tokenHandler,
	check: checkHandler,
}

// export routes
module.exports = routes
