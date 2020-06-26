<template>
    <div class="container">
        <RecipeView v-if="mode === 'view'" :recipe="currentRecipe" @close="close" />

        <RecipeEdit v-else-if="mode === 'edit'" :recipe="currentRecipe" @close="close" />

        <div v-else>
            <h1 class="border-bottom border-black">
                Recipes
                <span
                    v-if="loading"
                    class="spinner-border m-2"
                    style="border-width: 4px;"
                    role="status"
                ></span>
                <button
                    v-else
                    @click="openCreate"
                    type="button"
                    class="float-right btn btn-outline-success m-1 my-2"
                    data-toggle="tooltip"
                    title="New Recipe"
                >
                    <i class="fas fa-plus"></i>
                </button>
            </h1>

            <div v-if="recipes && recipes.length > 0">
                <div class="card-columns">
                    <RecipeCard
                        v-for="recipe in recipes"
                        :key="recipe._id"
                        :recipe="recipe"
                        @view="openView"
                        @edit="openEdit"
                        @favorite="toggleFavorite"
                        @delete="deleteRecipe"
                    />
                </div>
            </div>

            <div v-else-if="recipes && recipes.length === 0">
                <h5 class="text-center">No recipes</h5>
            </div>
        </div>
    </div>
</template>

<script>
import RecipeCard from "../components/RecipeCard";
import RecipeView from "../components/RecipeView";
import RecipeEdit from "../components/RecipeEdit";

import RecipeService from "../services/RecipeService";
import UserService from "../services/UserService";

import { Unit } from "../util/units";

export default {
    name: "Recipes",
    components: {
        RecipeCard,
        RecipeView,
        RecipeEdit
    },
    data() {
        return {
            loading: true,
            recipes: null,
            currentRecipe: null, // Recipe object
            mode: null, // 'edit' | 'view'
            multiplier: 1
        };
    },
    methods: {
        openCreate() {
            this.currentRecipe = {
                title: "New Recipe",
                description: "Enter a description...",
                serving: {
                    count: 1,
                    size: 1,
                    units: undefined
                },
                ingredients: [
                    {
                        name: "New ingredient",
                        amount: 1,
                        units: undefined
                    }
                ],
                steps: ["Step 1"],
                image: undefined
            };
            this.mode = "edit";
        },
        openEdit(recipe) {
            this.currentRecipe = recipe;
            this.mode = "edit";
        },
        openView(recipe) {
            this.currentRecipe = recipe;
            this.mode = "view";
        },
        close() {
            this.mode = null;
            this.currentRecipe = null;
        },
        toggleFavorite(recipe) {
            const i = this.$parent.user.favorites.indexOf(recipe._id);
            if (i >= 0) {
                // Remove favorite
                UserService.removeFavorite(recipe._id)
                    .then(({ status, data }) => {
                        switch (status) {
                            case 204:
                                this.$parent.user.favorites.splice(i, 1);
                                break;
                            case 401:
                                this.$parent._401();
                                this.$router.push("/");
                                break;
                            default:
                                this.$parent._500();
                                break;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.$parent._500();
                    });
            } else {
                // Add favorite
                UserService.addFavorite(recipe._id)
                    .then(({ status, data }) => {
                        switch (status) {
                            case 201:
                                this.$parent.user.favorites = data;
                                break;
                            case 401:
                                this.$parent._401();
                                this.$router.push("/");
                                break;
                            default:
                                this.$parent._500();
                                break;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.$parent._500();
                    });
            }
        },
        deleteRecipe(recipe) {
            // Send request to server
            RecipeService.deleteRecipe(recipe)
                .then(({ status }) => {
                    switch (status) {
                        case 204:
                            this.recipes = this.recipes.filter(
                                r => r._id !== recipe._id
                            );
                            break;
                        case 401:
                            this.$parent._401();
                            break;
                        default:
                            this.$parent._500();
                            break;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.$parent._500();
                });
        }
    },
    mounted() {
        RecipeService.getRecipes()
            .then(({ status, data }) => {
                switch (status) {
                    case 200:
                        this.recipes = [...data];
                        this.loading = false;
                        break;
                    default:
                        this.$parent._500();
                        break;
                }
            })
            .catch(err => {
                console.error(err);
                this.$parent._500();
            });
    }
};
</script>
