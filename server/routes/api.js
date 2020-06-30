const { createReadStream, existsSync, promises: { stat } } = require('fs')
const { join } = require('path')
const router = require('express').Router()

const corsHeaders = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080, https://cookshare.herokuapp.com')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
}

const echoToken = (req, res, next) => {
    res.send({ token: req.token })
}

const getUpload = async (req, res, next) => {
    const { filename } = req.params
    const filePath = join(__dirname, '..', 'uploads', filename)
    const ext = filename.split('.').pop()

    if (!existsSync(filePath)) return res.status(404).end()

    const { size } = await stat(filePath)

    res.setHeader('Content-Type', `image/${ext.toLowerCase()}`)
    res.setHeader('Content-Length', size)

    createReadStream(filePath).pipe(res)
}

router
    .use(corsHeaders)
    .get('/', echoToken)
    .get('/uploads/:filename', getUpload)
    .use('/auth', require('./auth'))
    .use('/user', require('./user'))
    .use('/recipe', require('./recipe'))
    .use('/cookbook', require('./cookbook'))

module.exports = router
