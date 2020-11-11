/* eslint-disable no-console */
const { promisify } = require('util')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const multer = require('multer')
const bearer = require('express-bearer-token')()
const verify = promisify(require('jsonwebtoken').verify)
const { v4 } = require('uuid')
const helmet = require('helmet')()

require('dotenv').config({ path: path.join(__dirname, '.env') })

const { User } = require('./models')
const { startAll } = require('./util/cron')

const PORT = process.env.PORT || 3000

const mongooseOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
}

const imageTypes = ['image/png', 'image/jpg', 'image/jpg']

const multerOptions = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, 'uploads'))
        },
        filename: (req, file, cb) => {
            cb(null, `${v4()}-${file.originalname}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        cb(null, imageTypes.includes(file.mimetype))
    }
}

const app = express()

app.use(morgan('dev'))
    .use(helmet)
    .use('/uploads', express.static(path.join(__dirname, 'uploads')))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(multer(multerOptions).single('image'))
    .use(bearer)
    .use(async (req, res, next) => {
        if (req.token) {
            try {
                const { _id } = await verify(req.token, process.env.JWT_SECRET)
                if (_id)
                    req.user = await User.findOne(
                        { _id, authToken: req.token },
                        '-password -authToken'
                    )
                next()
            } catch (err) {
                if (err.name === 'TokenExpiredError') next()
                else next(err)
            }
        } else next()
    })
    .use(require('./routes'))

const db = (tries, max) => {
    if (!tries) tries = 1
    if (max && max < 1) max = null
    if (!max) max = process.env.MAX_DB_TRIES

    mongoose
        .connect(process.env.MONGODB_URL, mongooseOptions)
        .then(({ connections: [{ name }] }) => {
            console.log(`Connected to database '${name}'`)
            const jobs = startAll()
            console.log(`All cron jobs started (${jobs})`)
        })
        .catch(_ => {
            console.log(
                `Database connection failed. Retrying... (${tries}/${
                    max || ''
                })`
            )
            if (!max || tries < max) db(tries + 1, max)
            else process.exit()
        })
}
db()

if (process.env.SERVER_ONLY && +process.env.SERVER_ONLY === 1)
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

module.exports = app
