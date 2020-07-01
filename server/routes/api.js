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

router
    .use(corsHeaders)
    .get('/', echoToken)
    .use('/auth', require('./auth'))
    .use('/user', require('./user'))
    .use('/recipe', require('./recipe'))
    .use('/cookbook', require('./cookbook'))

module.exports = router
