const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')()
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')()
const flash = require('connect-flash')()
const multer = require('multer')
const { startAll } = require('./util/cron')
require('dotenv').config()

const User = require('./models/user')

const PORT = process.env.PORT || 3000

const app = express()

const store = new MongoDBStore({
    uri: process.env.MONGODB_URL,
    collection: 'sessions'
})

const originWhitelist = [ 'https://cookshare.herokuapp.com/', 'http://localhost:8080' ]
const corsOptions = {
    origin: function(origin, callback) {
        if (originWhitelist.indexOf(origin) !== -1) callback(null, true)
        else callback(new Error('Not allowed by CORS'))
    },
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

const multerOptions = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString() + '-' + file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        cb(null, file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
    }
}

app
    .use(morgan('dev'))
    .use(express.static(path.join(__dirname, 'public')))
    .use('/uploads', express.static(path.join(__dirname, 'uploads')))
    .use(cors)
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(multer(multerOptions).array('images'))
    .use(session(sessionOptions))
    // .use(csrf)
    .use(flash)
    .use(async (req, res, next) => {
        if (req.session.user) {
            try {
                req.user = await User.findById(req.session.user._id)
                next()
            } catch (err) {
                next(err)
            }
        } else next()
    })
    .use('/api', require('./routes/api'))
    .use((req, res, next) => {
        res.status(404).send({ url: req.url })
    })
    .use((err, req, res, next) => {
        console.error(err)
        res.status(500).send({ error: process.env.NODE_ENV === 'development' ? err.message : 'Server Error' })
    })

const startServer = () => {
    mongoose
        .connect(process.env.MONGODB_URL, mongooseOptions)
        .then(({ connections: [ { name: name } ] }) => {
            console.log(`Connected to MongoDB database '${name}'`)
            app.listen(PORT, () => {
                console.log('Listening on port', PORT)
                startAll()
                console.log('All cron jobs started')
            })
        })
        .catch(err => {
            console.log('Database connection failed. Retrying...')
            startServer()
        })
}
startServer()
