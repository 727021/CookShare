import { get, set } from 'core-js/fn/dict'
import Vue from 'vue'
import Vuex, { createLogger } from 'vuex'

import auth from './auth'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth
    },
    plugins: [createLogger()],
    strict: process.env.NODE_ENV !== 'production'
})

// export default new Vuex.Store({
//     state: {
//         count: 0
//     },
//     getters: {},
//     mutations: {
//         // Must be synchronous
//         increment(state) {
//             // store.commit('increment')
//             state.count++
//         },
//         add(state, payload) {
//             // store.commit('add', { amount: 10 })
//             state.count += payload.amount
//         }
//     },
//     actions: {
//         // Can be asynchronous
//         increment(context) {
//             // store.dispatch('increment')
//             context.commit('increment')
//         },
//         // increment({ commit }) {
//         //     commit('increment')
//         // }
//         addAsync({ commit }, payload) {
//             // store.dispatch('addAsync', { amount: 10 }).then(/* ... */).catch(/* ... */)
//             return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     commit('add', payload)
//                 }, 1000)
//             })
//         }
//     },
//     modules: {
//         // Move modules to separate files
//         auth: {
//             namespaced: true,
//             state: () => ({}),
//             getters: {},
//             mutations: {},
//             actions: {}
//         }
//     }
// })

// In Components:
//
//   computed: {
//     ...mapState('some/nested/module', {
//       a: state => state.a,
//       b: state => state.b
//     }),
//     ...mapGetters('some/nested/module', [
//       'someGetter', // -> this.someGetter
//       'someOtherGetter', // -> this.someOtherGetter
//     ])
//   },
//   methods: {
//     ...mapActions('some/nested/module', [
//       'foo', // -> this.foo()
//       'bar' // -> this.bar()
//     ])
//   }

// Forms in Components:
//
// <input v-model="message" />
//
// computed: {
//     message: {
//         get() {
//             return this.$store.state.message
//         },
//         set(value) {
//             this.$store.commit('updateMessage', value)
//         }
//     }
// }