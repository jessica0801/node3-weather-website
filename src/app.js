const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { response } = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { createSecretKey } = require('crypto')

const app = express()
const port = process.env.PORT || 3000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//set up handlebars engine & views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
//set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    //1st arg: name of view to render, 2nd arg=obj w/ all info want view to access
    res.render('index', {
        title: 'Weather',
        name: 'Jessica Chai'
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Jessica Chai'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is the help page.',
        name: 'Jessica Chai'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    const address = req.query.address
    geocode(address, (error, {longitude, latitude, location} = {}) => {
        if (error){
            return res.send({ error })
        }
        forecast(longitude, latitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found.',
        name: 'Jessica Chai'
    })
})
//setting up 404 page (must come last) 
app.get('*', (req, res) => {
    res.render('404', {
        title:'404',
        errorMessage: 'Page not found.',
        name: 'Jessica Chai'
    })
})

//start server up
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})