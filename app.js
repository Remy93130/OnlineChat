const express = require('express')
const app = express()
const twig = require('twig')
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.render('index.twig', {name: 'remy'})
})

app.listen(8080, console.log('Listen port 8080'))