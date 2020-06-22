import axios from 'axios'
import { isEmail } from 'validator'

// TODO research token auth, maybe use Vuex for state management

const url = '/api/auth'

const login = (username, password) => {
    const data = isEmail(username || '') ? { email: username, password } : { username, password }
    return axios
        .put(url, data)
        .then(({ data }) => {
            return Promise.resolve({ status: 200, data })
        })
        .catch(({ response: { status, data } }) => {
            console.log(status, data)
            return Promise.resolve({ status, data })
        })
}
const register = () => {}
const logout = () => {}

export default {
    login
}
