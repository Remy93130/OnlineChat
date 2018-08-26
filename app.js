const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const twig = require('twig')
const ent = require('ent')

const server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || 'localhost'

function getTime() {
	d = new Date()
	return d.toTimeString().substr(0, 8)
}

var userLogged = []

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.render('index.twig')
})

io.on('connection', (socket) => {
	socket.on('new_user', (data) => {
		socket.username = ent.encode(data)
		userLogged.push(socket.username)
		console.log("New user: " + socket.username)
		socket.broadcast.emit("alter_user", {
			author: "System",
			time: getTime(),
			content: socket.username + " joined.",
			users: userLogged
		})
		console.log("Users online: " + userLogged)
	})

	socket.on('end_user', () => {
		console.log(socket.username + " left")
		userLogged.splice(userLogged.indexOf(socket.username), 1)
		socket.broadcast.emit("alter_user", {
			author: "System",
			time: getTime(),
			content: socket.username + " left",
			users: userLogged
		})
		console.log("Users online: " + userLogged)
	})

	socket.on('new_message', (data) => {
		socket.broadcast.emit("message", {
			author: socket.username,
			time: getTime(),
			content: ent.encode(data)
		})
	})
})

http.listen(8080, () => {
	console.log('Listening on ' + server_ip_address)
	console.log('Port ' + server_port)
})