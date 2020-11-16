import { isEmail } from 'validator'

import { Resolve, Post, Put, Delete } from './RequestSender'

import { CREATED } from '../util/status-codes'

const url = '/api/auth'

const login = (username, password) =>
    Resolve(Put(url, isEmail(username || '') ? { email: username, password } : { username, password }))

const register = (username, email, firstname, lastname, password, confirm) =>
    Resolve(Post(url, { username, email, firstname, lastname, password, confirm }), CREATED)

const logout = () => Delete(url).then(() => Promise.resolve()).catch(() => Promise.resolve())

export { login, register, logout }
