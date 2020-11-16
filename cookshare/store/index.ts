import { GetterTree, ActionTree, MutationTree } from 'vuex'

type empty = null | undefined | ''
export type RootState = { user: null; token: empty | string }

export const state = (): RootState => ({
    user: null,
    token: null
})

export const getters: GetterTree<RootState, RootState> = {
    isAuth: state => Boolean(state.token)
}

export const mutations: MutationTree<RootState> = {}

export const actions: ActionTree<RootState, RootState> = {}
