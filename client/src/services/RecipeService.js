import Send from './RequestSender'

const url = '/api/recipe'

export default {
    getRecipes() {
        return Send.get(url)
            .then(({ data }) => Promise.resolve({ status: 200, data }))
            .catch(({ response: { status, data } }) => Promise.resolve({ status, data }))
    },
    getUnits() {
        return Send.get(`${url}/units`)
            .then(({ data }) => Promise.resolve({ status: 200, data }))
            .catch(({ response: { status, data } }) => Promise.resolve({ status, data }))
    }
}
