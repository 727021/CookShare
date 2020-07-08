import { Resolve, Get, Post, Delete } from './RequestSender'

import { CREATED, EMPTY } from '../util/status-codes'

const url = '/api/user'

const getUser = uid => Resolve(Get(`${url}${uid ? `/${uid}` : ''}`))
const addFavorite = rid => Resolve(Post(`${url}/favorites/${rid}`, {}), CREATED)
const removeFavorite = rid => Resolve(Delete(`${url}/favorites/${rid}`, {}), EMPTY)

export { getUser, addFavorite, removeFavorite }
