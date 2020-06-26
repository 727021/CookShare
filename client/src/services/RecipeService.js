import Send from './RequestSender'

const url = '/api/recipe'

export default {
    getRecipes() {
        return Send.resolve(Send.get(url))
    },
    getUnits() {
        return Send.resolve(Send.get(`${url}/units`))
    },
    createRecipe(recipe) {
        Send.resolve
        return Send.resolve(Send.post(url, { ...recipe }), 201)
    },
    editRecipe(recipe) {
        const { _id, ...newRecipe } = recipe
        console.log(newRecipe)
        return Send.resolve(Send.put(`${url}/${_id}`, newRecipe))
    },
    deleteRecipe(recipe) {
        return Send.resolve(Send.delete(`${url}/${recipe._id}`), 204)
    }
}
