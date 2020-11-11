const { validationResult } = require('express-validator')
const { hash, compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')

const { User } = require('../models')
const { SALT_ROUNDS, JWT_EXPIRES_IN } = require('../util/constants')

exports.register = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(422).send({ errors: errors.array() })

    const { email, username, firstname, lastname, password } = req.body

    try {
        const passhash = await hash(password, SALT_ROUNDS)
        const user = await new User({
            email,
            username,
            password: passhash,
            name: {
                first: firstname,
                last: lastname
            }
        }).save()
        if (!user)
            return res.status(409).send({ error: 'Registration failed.' })
        res.status(201).send({ username: user.username })
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(422).send({ error: 'Invalid Login' })

    const { username, email, password } = req.body

    try {
        const user = await User.findOne(
            username ? { username } : { email },
            '-authToken'
        )
        if (!user) return res.status(409).send({ error: 'Invalid login' })
        const same = await compare(password, user.password)
        if (!same) return res.status(409).send({ error: 'Invalid login' })
        user.seen = Date.now()
        const token = await sign(
            {
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                joined: user.joined,
                seen: user.seen,
                admin: user.admin
            },
            process.env.JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )
        user.authToken = token
        await user.save()
        res.status(200).send({ token })
    } catch (err) {
        next(err)
    }
}

exports.logout = async (req, res, next) => {
    try {
        await User.findOneAndUpdate(
            { authToken: req.token },
            { authToken: undefined }
        )
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}

// TODO Implement password resets
exports.getPassword = (req, res, next) => {
    // 501 = Not Implemented
    res.status(501).end()
}

exports.putPassword = (req, res, next) => {
    res.status(501).end()
}
