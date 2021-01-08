// dependencies
const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')
const environment = require('./helpers/environment')
const data = require('./lib/data')
const utilities = require('./helpers/utilities')
const notifications = require('./helpers/notification')
// app object -module scaffolding
const app = {}

// @TODO remove
notifications.sendMessage('01989942856', 'hello world', (err) => {
	console.log(err)
})

// create server
app.createServer = () => {
	const server = http.createServer(app.handleReqRes)
	server.listen(environment.port, () =>
		console.log(`Server is listening at ${environment.port}`)
	)
}

// Handle request and response

app.handleReqRes = handleReqRes

// Start server
app.createServer()
