import { Resolve, Get, Post, Put, Delete } from './RequestSender'

const url = '/api/recipe'

const getRecipes = () => Resolve(Get(url))
const getUnits = () => Resolve(Get(`${url}/units`))
const createRecipe = recipe => Resolve(Post(url, { ...recipe }), 201)
const editRecipe = recipe => {
    const { _id, ...newRecipe } = recipe
    return Resolve(Put(`${url}/${_id}`, newRecipe))
}
const deleteRecipe = recipe => Resolve(Delete(`${url}/${recipe._id}`), 204)

export { getRecipes, getUnits, createRecipe, editRecipe, deleteRecipe }
