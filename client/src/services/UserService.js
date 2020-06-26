import Send from './RequestSender'

const url = '/api/user'

export default {
    getUser: uid => Send.resolve(Send.get(`${url}${uid ? `/${uid}` : ''}`)),
    addFavorite: rid => Send.resolve(Send.post(`${url}/favorites/${rid}`, {}), 201),
    removeFavorite: rid => Send.resolve(Send.delete(`${url}/favorites/${rid}`, {}), 204)
}
