const router = require('express').Router()
const { body, param } = require('express-validator')

const { needsAuth, needsAdmin } = require('../middleware/isAuth')
const {
    getSelf,
    changePassword,
    getAll,
    getFavorites,
    postFavorites,
    deleteFavorites,
    putAdmin,
    getUser,
    deleteUser
} = require('../controllers/user')

router
    .get('/', needsAuth, getSelf)
    .put(
        '/',
        needsAuth,
        [
            body('password', 'Password must be at least 8 characters long.').isLength({ min: 8 }).trim(),
            body('confirm')
                .custom((value, { req }) => {
                    if (value !== req.body.password) throw new Error("Passwords don't match.")
                    return true
                })
                .trim()
        ],
        changePassword
    )
    .get('/all', needsAuth, getAll)
    .get('/favorites', needsAuth, getFavorites)
    .post('/favorites', needsAuth, [ body('rid', 'Invalid recipe ID').isMongoId() ], postFavorites)
    .delete('/favorites', needsAuth, [ body('rid', 'Invalid recipe ID').isMongoId() ], deleteFavorites)
    .put('/admin', needsAdmin, [ body('uid', 'Invalid user ID').isMongoId(), body('admin').toBoolean() ], putAdmin)
    .get('/:uid', needsAuth, [ param('uid', 'Invalid user ID').isMongoId() ], getUser)
    .delete('/', needsAuth, [ body('uid', 'Invalid user ID').isMongoId() ], deleteUser)

module.exports = router
