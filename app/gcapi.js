const express = require('express')
const path = require('path')
require('dotenv').config()

// Routes.
const index = require('./routes/index')
const all = require('./routes/all')
const secondary = require('./routes/secondary')
const continents = require('./routes/continents')
const countries = require('./routes/countries')
const demo = require('./routes/demo')

// Middleware.
const timeout = require('connect-timeout')
const pretty = require('express-prettify')
const cors = require('cors')

// Setup express app.
const app = express('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(timeout('5s'))
app.use(pretty({
    query: 'prettify'
}))
app.use(cors({
    methods: 'GET'
}))

app.use('/', index)
app.use('/api/v1/all', all)
app.use('/api/v1/secondary', secondary)
app.use('/api/v1/', continents)
app.use('/api/v1/', countries)
app.use('/demo', demo)

app.get('*', (req, res) => {
    app.use(express.static(path.join(__dirname, '/../assets')))
    res.render('404.ejs')
})

app.listen(process.env.port || 3000)
console.log('http://localhost:3000/api/v1/all?prettify')
