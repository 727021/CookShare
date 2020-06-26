import { isEmail } from 'validator'

import Send from './RequestSender'

const url = '/api/auth'

export default {
    login: (username, password) => {
        const data = isEmail(username || '') ? { email: username, password } : { username, password }
        return Send.resolve(Send.put(url, data))
    },

    register: (username, email, firstname, lastname, password, confirm) =>
        Send.resolve(Send.post(url, { username, email, firstname, lastname, password, confirm }), 201),

    logout: () => Send.delete(url).then(() => Promise.resolve()).catch(() => Promise.resolve())
}
