const { promisify } = require('util')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const mongoose = require('mongoose')
const multer = require('multer')
const verify = promisify(require('jsonwebtoken').verify)
const bearer = require('express-bearer-token')()
const { v4 } = require('uuid')
require('dotenv').config()

const { startAll } = require('./util/cron')
const User = require('./models/user')

const PORT = process.env.PORT || 3000

const app = express()

const mongooseOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
}

const multerOptions = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, v4() + '-' + file.originalname)
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
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(multer(multerOptions).array('images'))
    .use(bearer)
    .use(async (req, res, next) => {
        if (req.token) {
            try {
                const { _id } = await verify(req.token, process.env.JWT_SECRET)
                if (_id) req.user = await User.findOne({ _id, authToken: req.token })
                next()
            } catch (err) {
                switch (err.name) {
                    case 'TokenExpiredError':
                        next()
                        break
                    default:
                        next(err)
                }
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
                const numJobs = startAll()
                console.log(`All cron jobs started (${numJobs})`)
            })
        })
        .catch(err => {
            console.log('Database connection failed. Retrying...')
            startServer()
        })
}
startServer()
