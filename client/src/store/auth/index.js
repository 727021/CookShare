import { auth } from '../types'
const {
    getters: { IS_LOGGED_IN }
    // actions: {},
    // mutations: {}
} = auth

export default {
    namespaced: true,
    state: () => ({}),
    getters: {
        [IS_LOGGED_IN](state) {
            return false
        }
    },
    actions: {},
    mutations: {}
}
