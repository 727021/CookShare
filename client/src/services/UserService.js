import { Resolve, Get, Post, Delete } from './RequestSender'

const url = '/api/user'

const getUser = uid => Resolve(Get(`${url}${uid ? `/${uid}` : ''}`))
const addFavorite = rid => Resolve(Post(`${url}/favorites/${rid}`, {}), 201)
const removeFavorite = rid => Resolve(Delete(`${url}/favorites/${rid}`, {}), 204)

export { getUser, addFavorite, removeFavorite }
