<template>
    <b-container>
        <RecipeView
            v-if="mode === 'view'"
            :recipe="currentRecipe"
            @close="close"
        />

        <RecipeEdit
            v-else-if="mode === 'edit'"
            :recipe="currentRecipe"
            :recipes="recipes"
            @close="close"
            @401="$emit('401')"
            @500="_500"
        />

        <div v-else>
            <h1 class="border-bottom">
                Recipes
                <b-spinner
                    class="m-2"
                    style="border-width: 4px;"
                    v-if="loading"
                />
                <b-btn
                    v-else
                    variant="outline-success"
                    @click="openCreate"
                    class="float-right m-1 my-2"
                    v-b-tooltip.hover.left
                    title="New Recipe"
                >
                    <fa-icon icon="plus" />
                </b-btn>
            </h1>

            <b-card-group v-if="recipes && recipes.length > 0" columns>
                <RecipeCard
                    v-for="recipe in recipes"
                    :key="recipe._id"
                    :recipe="recipe"
                    :recipes="recipes"
                    :user="user"
                    @view="openView"
                    @edit="openEdit"
                    @401="$emit('401')"
                    @500="_500"
                />
            </b-card-group>

            <h5 v-else-if="recipes && recipes.length === 0" class="text-center">
                No recipes
            </h5>
        </div>
    </b-container>
</template>

<script>
import RecipeCard from "../components/RecipeCard";
import RecipeView from "../components/RecipeView";
import RecipeEdit from "../components/RecipeEdit";

import { getRecipes } from "../services/RecipeService";

import { Unit } from "../util/units";
import { SUCCESS, AUTH_ERROR } from "../util/status-codes";

export default {
    name: "Recipes",
    props: ["user"],
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
            mode: null // null | 'edit' | 'view'
        };
    },
    methods: {
        openCreate() {
            this.currentRecipe = {
                title: "",
                description: "",
                serving: {
                    count: 1,
                    size: 1,
                    units: undefined
                },
                ingredients: [
                    {
                        name: "",
                        amount: 1,
                        units: undefined
                    }
                ],
                steps: [""],
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
        _500(err) {
            this.$emit("500", err);
        }
    },
    mounted() {
        getRecipes()
            .then(({ status, data }) => {
                switch (status) {
                    case SUCCESS:
                        this.recipes = [...data];
                        this.loading = false;
                        break;
                    case AUTH_ERROR:
                        this.$emit("401");
                        break;
                    default:
                        this._500();
                        break;
                }
            })
            .catch(err => {
                this._500(err);
            });
    }
};
</script>
