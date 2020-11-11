const authUtil = require('../util/isAuth')

module.exports = {
    /**
     * Redirect if not authenticated
     */
    needsAuth: (req, res, next) => {
        if (authUtil.isAuth(req)) return next()
        res.status(401).send({ error: 'Not logged in' })
    },

    /**
     * Redirect if authenticated
     */
    noAuth: (req, res, next) => {
        if (!authUtil.isAuth(req)) return next()
        res.status(401).send({ error: 'Already logged in' })
    },

    /**
     * Redirect if not an admin
     */
    needsAdmin: (req, res, next) => {
        if (authUtil.isAdmin(req)) return next()
        res.status(401).send({ error: 'Admin rights required' })
    }
}
