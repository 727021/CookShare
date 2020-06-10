const router = require('express').Router()
const { body, oneOf } = require('express-validator')

const User = require('../models/user')
const { notAuth } = require('../middleware/isAuth')
const { register, login, logout, getPassword, putPassword } = require('../controllers/auth')

router
    .post(
        '/',
        notAuth,
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
                .custom((value, { req }) => {
                    User.findOne({ username: value }).then(user => {
                        if (user) return Promise.reject('Username already in use.')
                    })
                })
                .trim(),
            body('firstname', 'Please enter your first name.').isString().notEmpty().trim(),
            body('lastname', 'Please enter your last name.').isString().notEmpty().trim(),
            body('password', 'Password must be at least 8 characters long.').isLength({ min: 8 }).trim(),
            body('confirm')
                .custom((value, { req }) => {
                    if (value !== req.body.password) throw new Error("Passwords don't match.")
                    return true
                })
                .trim()
        ],
        register
    )
    .put(
        '/',
        notAuth,
        [
            oneOf(
                [
                    body('username').isAlphanumeric().isLength({ min: 6, max: 32 }).trim(),
                    body('email').isEmail().normalizeEmail()
                ],
                'Invalid Login'
            ),
            body('password', 'Invalid Login').isLength({ min: 8 }).trim()
        ],
        login
    )
    .delete('/', logout)
    .get('/password', [], getPassword)
    .put('/password/:reset', [], putPassword)

module.exports = router
