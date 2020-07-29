<template>
    <b-modal id="addRecipe" scrollable no-stacking @shown="shown">
        <template v-slot:modal-title>
            Add Recipe to <span class="text-primary">{{ cookbook.title }}</span>
        </template>
        <template v-slot:modal-header-close>
            <fa-icon icon="times" />
        </template>
        <template v-slot:modal-footer>
            <b-btn variant="outline-secondary" @click="hide">Cancel</b-btn>
            <b-btn
                variant="success"
                @click="$emit('add', cookbook._id, recipe)"
                :disabled="loading || error.length > 0"
                >Add Recipe</b-btn
            >
        </template>
        <b-form-group label="Recipe">
            <template v-slot:invalid-feedback>
                <span class="float-left">{{ error }}</span>
            </template>
            <template v-slot:description>
                <span class="float-right">{{
                    error
                        ? ""
                        : loading
                        ? "Loading..."
                        : `${recipes.length} Recipe${
                              recipes.length === 1 ? "" : "s"
                          }`
                }}</span>
            </template>
            <b-select
                :disabled="loading"
                :options="recipes"
                value-field="_id"
                text-field="title"
                v-model="recipe"
                :state="error.length > 0 ? false : null"
            >
            </b-select>
        </b-form-group>
    </b-modal>
</template>

<script>
import { getRecipes } from "../services/RecipeService";

import { SUCCESS, AUTH_ERROR, DATA_ERROR } from "../util/status-codes";

export default {
    name: "AddRecipeModal",
    data: () => ({
        cookbook: { title: "" },
        recipe: null,
        error: "",
        loading: true,
        recipes: [],
    }),
    methods: {
        show(cookbook) {
            this.loading = true;
            this.cookbook = cookbook;
            this.error = "";
            this.recipes = [];
            this.$bvModal.show("addRecipe");
        },
        hide() {
            this.$bvModal.hide("addRecipe");
        },
        setError(err) {
            this.error = err;
        },
        shown() {
            // Load user recipes
            getRecipes()
                .then(({ status, data }) => {
                    switch (status) {
                        case SUCCESS:
                            this.loading = false;
                            this.recipes = data.filter(
                                (d) =>
                                    !this.cookbook.recipes.some(
                                        (r) =>
                                            (
                                                r.recipe._id || r.recipe
                                            ).toString() === d._id.toString()
                                    )
                            );
                            if (this.recipes.length === 0)
                                return (this.error = "No Recipes");
                            this.recipe = data[0]._id;
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        default:
                            this.$emit("500");
                            break;
                    }
                })
                .catch((err) => {
                    this.$emit("500", err);
                });
        },
    },
};
</script>