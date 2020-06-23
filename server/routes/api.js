const router = require('express').Router()

router
    .use('/', (req, res, next) => {
        // CORS Headers for all API requests
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080, https://cookshare.herokuapp.com')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        next()
    })
    .get('/', (req, res, next) => res.send({ token: req.token })) // Echo received JWT
    .use('/auth', require('./auth'))
    .use('/user', require('./user'))
    .use('/recipe', require('./recipe'))
    .use('/cookbook', require('./cookbook'))

// Only provide access to raw session data in dev
// if (process.env.NODE_ENV === 'development')
//     router.post('/session', (req, res, next) => {
//         res.send(req.session)
//     })

module.exports = router
