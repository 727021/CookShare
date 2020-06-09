const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')()
const flash = require('connect-flash')()
require('dotenv').config()

const PORT = process.env.PORT || 3000

const app = express()

const store = new MongoDBStore({
    uri: process.env.MONGODB_URL,
    collection: 'sessions'
})

const corsOptions = {
    origin: 'https://cookshare.herokuapp.com/',
    optionsSuccessStatus: 200
}

const mongooseOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
}

const sessionOptions = {
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}

app
    .set('views', path.join(__dirname, 'views'))
    .set('view-engine', 'ejs')
    .use(morgan('dev'))
    .use(express.static(path.join(__dirname, 'public')))
    .use(cors(corsOptions))
    .use(bodyParser({ extended: true }))
    .use(session(sessionOptions))
    .use(csrf)
    .use(flash)
    .use((req, res, next) => {
        res.locals.csrf = req.csrfToken()
        next()
    })
    // .use('/', require('path/to/router'))
    .use((req, res, next) => {
        // res.render('404')
        res.send('Hello, World!')
    })
    .use((err, req, res, next) => {
        // res.render('500')
        res.end()
    })

mongoose
    .connect(process.env.MONGODB_URL, mongooseOptions)
    .then(({ connections: [ { name: name } ] }) => {
        console.log(`Connected to MongoDB database '${name}'`)
        app.listen(PORT, () => console.log('Listening on port', PORT))
    })
    .catch(console.error)
