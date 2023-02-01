const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
var mongoose = require('mongoose');
mongoose.set('debug', true);

const PORT = process.env.PORT || 5000

//connect to db
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.send('Hello')
})

//Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/planets', require('./routes/planetRoutes'))
// app.use('/api/buildings', require('./routes/buildingRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


const {processBuildingQueue} = require('./controllers/queueController')
const {processPlanetResources} = require('./controllers/planetController')

setInterval(() => {
    console.log('queue timer')
    processBuildingQueue()
    processPlanetResources()
}, 5000);