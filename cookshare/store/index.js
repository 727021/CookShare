export const state = () => ({
    user: null,
    token: null
})

export const getters = {
    isAuth: state => Boolean(state.token)
}
