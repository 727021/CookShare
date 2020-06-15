const router = require('express').Router()

router
    .get('/', (req, res, next) => {
        // TODO Make this route useful or remove it
        res.send('Hello, World!')
    })
    .use('/auth', require('./auth'))
    .use('/user', require('./user'))
    .use('/recipe', require('./recipe'))
    .use('/cookbook', require('./cookbook'))

// Only provide access to raw session data in dev
if (process.env.NODE_ENV === 'development')
    router.post('/session', (req, res, next) => {
        res.send(req.session)
    })

module.exports = router
