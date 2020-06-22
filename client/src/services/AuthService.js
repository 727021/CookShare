import { isEmail } from 'validator'

import Send from './RequestSender'

const url = '/api/auth'

export default {
    login: (username, password) => {
        const data = isEmail(username || '') ? { email: username, password } : { username, password }
        return Send.put(url, data)
            .then(({ data }) => Promise.resolve({ status: 200, data }))
            .catch(({ response: { status, data } }) => Promise.resolve({ status, data }))
    },

    register: (username, email, firstname, lastname, password, confirm) =>
        Send.post(url, { username, email, firstname, lastname, password, confirm })
            .then(({ data }) => Promise.resolve({ status: 201, data }))
            .catch(({ response: { status, data } }) => Promise.resolve({ status, data })),

    logout: () => Send.delete(url).then(() => Promise.resolve()).catch(() => Promise.resolve())
}
