<template>
    <b-card :img-src="recipe.image" :img-top="recipe.image">
        <b-card-title class="my-0">
            <b-btn
                class="py-0"
                variant="link"
                size="lg"
                @click="$emit('view', recipe)"
            >{{recipe.title}}</b-btn>
        </b-card-title>
        <b-card-body v-if="recipe.description">
            <b-card-text>{{recipe.description}}</b-card-text>
        </b-card-body>
        <template v-slot:footer>
            <b-btn-toolbar>
                <b-btn-group
                    v-if="recipe.author === $parent.$parent.user._id ||recipe.author._id === $parent.$parent.user._id"
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
                        :text-variant="{'white': isFavorite()}"
                        v-b-tooltip.hover.right
                        :title="isFavorite() ? 'Unfavorite' : 'Favorite'"
                        @click="toggleFavorite"
                        :disabled="disabled"
                    >
                        <fa-icon :icon="[isFavorite() ? 'fas' : 'far', 'heart']" />
                    </b-btn>
                </b-btn-group>
            </b-btn-toolbar>
        </template>
    </b-card>
    <!-- <div class="card">
        <img v-if="recipe.image" :src="recipe.image" class="card-img-top" />
        <div class="card-body">
            <h5 class="card-title">
                <button
                    :disabled="disabled"
                    class="btn btn-lg btn-link p-0"
                    @click.prevent="$emit('view', recipe)"
                >{{recipe.title}}</button>
            </h5>
            <p class="card-text">{{recipe.description}}</p>
        </div>
        <div class="card-footer">
            <div class="btn-toolbar justify-content-between flex-row-reverse" role="toolbar">
                <div class="btn-group" role="group">
                    <a
                        v-b-tooltip.hover.left
                        title="Print"
                        :disabled="disabled"
                        @click.prevent
                        class="btn btn-sm btn-outline-primary"
                        role="button"
                        target="_blank"
                        :href="`/pdf/${recipe._id}`"
                    >
                        <fa-icon icon="print" />
                    </a>
                    <button
                        v-b-tooltip.hover.right
                        :title="isFavorite() ? 'Unfavorite' : 'Favorite'"
                        :disabled="disabled"
                        @click="toggleFavorite"
                        class="btn btn-sm btn-outline-danger"
                        :class="{'btn-outline-danger': !isFavorite(), 'btn-danger text-white': isFavorite()}"
                        type="button"
                    >
                        <fa-icon :icon="[isFavorite() ? 'fas' : 'far', 'heart']" />
                    </button>
                </div>
                <div
                    v-if="recipe.author === this.$parent.$parent.user._id || recipe.author._id === this.$parent.$parent.user._id"
                    class="btn-group"
                    role="group"
                >
                    <button
                        v-b-tooltip.hover.left
                        title="Delete"
                        :disabled="disabled"
                        class="btn btn-sm btn-outline-danger"
                        type="button"
                        @click="deleteRecipe"
                    >
                        <fa-icon icon="trash-alt" />
                    </button>
                    <button
                        v-b-tooltip.hover.right
                        title="Edit"
                        :disabled="disabled"
                        class="btn btn-sm btn-outline-primary"
                        type="button"
                        @click="$emit('edit', recipe)"
                    >
                        <fa-icon icon="pencil-alt" />
                    </button>
                </div>
            </div>
        </div>
    </div>-->
</template>

<script>
import { deleteRecipe } from "../services/RecipeService";
import { addFavorite, removeFavorite } from "../services/UserService";

export default {
    name: "RecipeCard",
    props: ["recipe"],
    data() {
        return {
            disabled: false
        };
    },
    methods: {
        isFavorite() {
            const id = this.recipe._id;
            return this.$parent.$parent.user.favorites.some(r => r === id);
        },
        deleteRecipe() {
            // Disable buttons
            this.disabled = true;
            // Send request to server
            deleteRecipe(this.recipe)
                .then(({ status }) => {
                    switch (status) {
                        case 204:
                            this.$parent.recipes = this.$parent.recipes.filter(
                                r => r._id !== this.recipe._id
                            );
                            break;
                        case 401:
                            this.$parent.$parent._401();
                            break;
                        default:
                            this.$parent.$parent._500();
                            break;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.$parent.$parent._500();
                });
        },
        toggleFavorite() {
            const i = this.$parent.$parent.user.favorites.indexOf(
                this.recipe._id
            );
            if (i >= 0) {
                // Remove favorite
                removeFavorite(this.recipe._id)
                    .then(({ status, data }) => {
                        switch (status) {
                            case 204:
                                this.$parent.$parent.user.favorites.splice(
                                    i,
                                    1
                                );
                                break;
                            case 401:
                                this.$parent.$parent._401();
                                this.$router.push("/");
                                break;
                            default:
                                this.$parent.$parent._500();
                                break;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.$parent.$parent._500();
                    });
            } else {
                // Add favorite
                addFavorite(this.recipe._id)
                    .then(({ status, data }) => {
                        switch (status) {
                            case 201:
                                this.$parent.$parent.user.favorites = data;
                                break;
                            case 401:
                                this.$parent.$parent._401();
                                this.$router.push("/");
                                break;
                            default:
                                this.$parent.$parent._500();
                                break;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.$parent.$parent._500();
                    });
            }
        },
        token() {
            return localStorage.getItem("token");
        }
    }
};
</script>