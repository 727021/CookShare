const router = require('express').Router()

const { cors, needsAuth } = require('../middleware')
const { echoToken, getPdf, get404, get500 } = require('../controllers')

router
    .use(cors)
    .get('/', echoToken)
    .use('/auth', require('./auth'))
    .use('/user', require('./user'))
    .use('/recipe', require('./recipe'))
    .use('/cookbook', require('./cookbook'))
    .get('/pdf/:rid', needsAuth, getPdf)
    .use(get404)
    .use(get500)

module.exports = router
