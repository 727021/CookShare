<template>
    <b-card :img-src="recipe.image" :img-top="recipe.image">
        <b-card-title class="my-0">
            <b-btn
                class="py-0"
                variant="link"
                size="lg"
                @click="$emit('view', recipe)"
                >{{ recipe.title }}</b-btn
            >
        </b-card-title>
        <b-card-body v-if="recipe.description">
            <b-card-text>{{ recipe.description }}</b-card-text>
        </b-card-body>
        <template v-slot:footer>
            <b-btn-toolbar>
                <b-btn-group
                    v-if="
                        recipe.author === user._id ||
                            recipe.author._id === user._id
                    "
                    size="sm"
                >
                    <b-btn
                        variant="outline-danger"
                        v-b-tooltip.hover.left
                        title="Delete"
                        :disabled="disabled"
                        @click="deleteRecipe"
                    >
                        <fa-icon icon="trash-alt" />
                    </b-btn>
                    <b-btn
                        variant="outline-primary"
                        v-b-tooltip.hover.right
                        title="Edit"
                        :disabled="disabled"
                        @click="$emit('edit', recipe)"
                    >
                        <fa-icon icon="pencil-alt" />
                    </b-btn>
                </b-btn-group>
                <b-btn-group size="sm" class="ml-auto">
                    <b-btn
                        variant="outline-primary"
                        v-b-tooltip.hover.left
                        title="Print"
                        :disabled="disabled"
                        :href="`/pdf/${recipe._id}?access_token=${token()}`"
                        target="_blank"
                    >
                        <fa-icon icon="print" />
                    </b-btn>
                    <b-btn
                        :variant="isFavorite() ? 'danger' : 'outline-danger'"
                        :text-variant="{ white: isFavorite() }"
                        v-b-tooltip.hover.right
                        :title="isFavorite() ? 'Unfavorite' : 'Favorite'"
                        @click="toggleFavorite"
                        :disabled="disabled"
                    >
                        <fa-icon
                            :icon="[isFavorite() ? 'fas' : 'far', 'heart']"
                        />
                    </b-btn>
                </b-btn-group>
            </b-btn-toolbar>
        </template>
    </b-card>
</template>

<script>
import { deleteRecipe } from "../services/RecipeService";
import { addFavorite, removeFavorite } from "../services/UserService";

import { EMPTY, CREATED, AUTH_ERROR } from "../util/status-codes";

export default {
    name: "RecipeCard",
    props: ["recipe", "recipes", "user"],
    data() {
        return {
            disabled: false
        };
    },
    methods: {
        isFavorite() {
            const id = this.recipe._id;
            return this.user.favorites.some(r => r === id);
        },
        deleteRecipe() {
            // Disable buttons
            this.disabled = true;
            // Send request to server
            deleteRecipe(this.recipe)
                .then(({ status }) => {
                    switch (status) {
                        case EMPTY:
                            this.recipes = this.recipes.filter(
                                r => r._id !== this.recipe._id
                            );
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        default:
                            this.$emit("500");
                            break;
                    }
                })
                .catch(err => {
                    this.$emit("500", err);
                });
        },
        toggleFavorite() {
            const i = this.user.favorites.indexOf(this.recipe._id);
            if (i >= 0) {
                // Remove favorite
                removeFavorite(this.recipe._id)
                    .then(({ status, data }) => {
                        switch (status) {
                            case EMPTY:
                                this.user.favorites.splice(i, 1);
                                break;
                            case AUTH_ERROR:
                                this.$emit("401");
                                this.$router.push("/");
                                break;
                            default:
                                this.$emit("500");
                                break;
                        }
                    })
                    .catch(err => {
                        this.$emit("500", err);
                    });
            } else {
                // Add favorite
                addFavorite(this.recipe._id)
                    .then(({ status, data }) => {
                        switch (status) {
                            case CREATED:
                                this.user.favorites = data;
                                break;
                            case AUTH_ERROR:
                                this.$emit("401");
                                this.$router.push("/");
                                break;
                            default:
                                this.$emit("500");
                                break;
                        }
                    })
                    .catch(err => {
                        this.$emit("500", err);
                    });
            }
        },
        token() {
            return localStorage.getItem("token");
        }
    }
};
</script>