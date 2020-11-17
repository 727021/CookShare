import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { decode } from 'jsonwebtoken'

import { User, Recipe } from '@/types/api'

type empty = null | undefined
type id = { id: string }
export type RootState = { user: User | empty; token: string | empty }

export const state = (): RootState => ({
    user: null,
    token: null
})

export const getters: GetterTree<RootState, RootState> = {
    isAuth: _state => Boolean(_state.token)
}

export const mutations: MutationTree<RootState> = {
    setUser: (_state, payload: User | empty) => {},
    setToken: (_state, payload: string | empty) => {},
    addFavorite: (_state, payload: Recipe | id) => {},
    removeFavorite: (_state, payload: Recipe | id) => {}
}

export const actions: ActionTree<RootState, RootState> = {
    finishLogin: ({ commit }, { token }: { token: string }) => {
        commit('setToken', token)
        commit('setUser', decode(token) as User)
    },
    finishLogout: ({ commit }) => {
        commit('setUser', null)
        commit('setToken', null)
    }
}
