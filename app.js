const express = require('express')
const app = express()
const twig = require('twig')
const path = require('path')

const server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || 'localhost'

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.render('index.twig', {name: 'remy'})
})

app.listen(8080, () => {
	console.log('Listening on ' + server_ip_address)
	console.log('Port ' + server_port)
})