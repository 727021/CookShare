import axios from 'axios'

const bindToken = () => {
    const token = localStorage.getItem('token')
    return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
}

const Get = url => axios.get(url, bindToken())
const Post = (url, body) => axios.post(url, body, bindToken())
const Put = (url, body) => axios.put(url, body, bindToken())
const Delete = url => axios.delete(url, bindToken())
const Resolve = (promise, success = 200) =>
    promise
        .then(({ data }) => Promise.resolve({ status: success, data }))
        .catch(({ response: { status, data } }) => Promise.resolve({ status, data }))

export { Get, Post, Put, Delete, Resolve }
