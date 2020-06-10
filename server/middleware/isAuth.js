module.exports = {
    /**
     * Redirect if not authenticated
     */
    isAuth: (req, res, next) => {
        next()
    },
    /**
     * Redirect if authenticated
     */
    notAuth: (req, res, next) => {
        next()
    },
    /**
     * Redirect if not an admin
     */
    isAdmin: (req, res, next) => {
        next()
    }
}
