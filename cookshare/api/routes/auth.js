const router = require('express').Router()
const { body, oneOf } = require('express-validator')

const { User } = require('../models')
const { noAuth } = require('../middleware')
const {
    register,
    login,
    logout,
    getPassword,
    putPassword
} = require('../controllers/auth')

router
    .post(
        '/',
        noAuth,
        [
            body('email')
                .isEmail()
                .withMessage('Please enter a valid email.')
                .normalizeEmail()
                .custom((value, { req }) => {
                    return User.findOne({ email: value }).then(user => {
                        if (user) return Promise.reject('Email already in use.')
                    })
                }),
            body('username')
                .isAlphanumeric()
                .withMessage('Username may only contain letters and numbers.')
                .isLength({ min: 6, max: 32 })
                .withMessage('Username must be between 6 and 32 characters.')
                .trim()
                .custom((value, { req }) => {
                    return User.findOne({ username: value }).then(user => {
                        if (user)
                            return Promise.reject('Username already in use.')
                    })
                }),
            body('firstname', 'Please enter your first name.')
                .isString()
                .notEmpty()
                .trim(),
            body('lastname', 'Please enter your last name.')
                .isString()
                .notEmpty()
                .trim(),
            body('password', 'Password must be at least 8 characters long.')
                .isLength({ min: 8 })
                .trim(),
            body('confirm')
                .custom((value, { req }) => {
                    if (value !== req.body.password)
                        throw new Error("Passwords don't match.")
                    return true
                })
                .trim()
        ],
        register
    )
    .put(
        '/',
        noAuth,
        [
            oneOf([
                body('username')
                    .isAlphanumeric()
                    .isLength({ min: 6, max: 32 })
                    .trim(),
                body('email').isEmail().normalizeEmail()
            ]),
            body('password').isLength({ min: 8 }).trim()
        ],
        login
    )
    .delete('/', logout)
    // TODO Implement password reset validation
    .get('/password', [], getPassword)
    .put('/password/:reset', [], putPassword)

module.exports = router
