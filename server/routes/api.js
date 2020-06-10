const router = require('express').Router()

// List of /api subroutes
const paths = [ 'auth', 'user', 'recipe', 'cookbook' ]

router.get('/', (req, res, next) => res.send('Hello, World!'))

for (path in paths) router.use(`/${path}`, require(`./${path}`))

module.exports = router
