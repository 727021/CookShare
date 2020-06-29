import { isEmail } from 'validator'

import { Resolve, Post, Put, Delete } from './RequestSender'

const url = '/api/auth'

const login = (username, password) =>
    Resolve(Put(url, isEmail(username || '') ? { email: username, password } : { username, password }))

const register = (username, email, firstname, lastname, password, confirm) =>
    Resolve(Post(url, { username, email, firstname, lastname, password, confirm }), 201)

const logout = () => Delete(url).then(() => Promise.resolve()).catch(() => Promise.resolve())

export default {
    login,
    register,
    logout
}
