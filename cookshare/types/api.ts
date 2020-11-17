export type Serving = {
    count: number
    size: number
    units?: string
}

export type Ingredient = {
    name: string
    amount: number
    units?: string
}

export interface Recipe {
    readonly _id: string
    author: string | User
    title: string
    description?: string
    serving: Serving
    ingredients: Ingredient[]
    steps?: string[]
    image?: string
}

export interface User {
    readonly _id: string
    email: string
    username: string
    name: {
        first: string
        last: string
    }
    joined?: Date
    seen?: Date
    admin: boolean
    favorites?: string[] | Recipe[]
    authToken?: string
}

export type Status = {
    requested?: boolean
    invited?: boolean
    accepted?: boolean
    rejected?: boolean
}

export type Shared = {
    readonly _id: string
    user: string | User
    status: Status
}

export type Comment = {
    readonly _id: string
    author: string | User
    date: Date
    message: string
}

export type CookbookRecipe = {
    recipe: string | Recipe
    comments: Comment[]
}

export interface Cookbook {
    readonly _id: string
    title: string
    owner: string | User
    shared?: Shared[]
    recipes?: CookbookRecipe[]
}
