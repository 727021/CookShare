import axios from 'axios'

const bindToken = () => {
    const token = localStorage.getItem('token')
    return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
}

export default {
    get: url => axios.get(url, bindToken()),

    post: (url, body) => axios.post(url, body, bindToken()),

    put: (url, body) => axios.put(url, body, bindToken()),

    delete: url => axios.delete(url, bindToken()),

    resolve: (promise, success) =>
        promise
            .then(({ data }) => Promise.resolve({ status: success || 200, data }))
            .catch(({ response: { status, data } }) => Promise.resolve({ status, data }))
}
