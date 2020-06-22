import Send from './RequestSender'

const url = '/api/user'

export default {
    getUser: uid =>
        Send.get(`${url}${uid ? `/${uid}` : ''}`)
            .then(({ data }) => Promise.resolve({ status: 200, data }))
            .catch(({ response: { status, data } }) => Promise.resolve({ status, data }))
}
