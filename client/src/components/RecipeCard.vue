<template>
    <div class="card">
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
                        :disabled="disabled"
                        @click.prevent
                        class="btn btn-sm btn-outline-primary"
                        role="button"
                        target="_blank"
                        :href="`/pdf/${recipe._id}`"
                    >
                        <i class="fas fa-print"></i>
                    </a>
                    <button
                        :disabled="disabled"
                        @click="toggleFavorite"
                        class="btn btn-sm btn-outline-danger"
                        :class="{'btn-outline-danger': !isFavorite(), 'btn-danger text-white': isFavorite()}"
                        type="button"
                    >
                        <i :class="{'far': !isFavorite(), 'fas': isFavorite()}" class="fa-heart"></i>
                    </button>
                </div>
                <div
                    v-if="recipe.author === this.$parent.$parent.user._id || recipe.author._id === this.$parent.$parent.user._id"
                    class="btn-group"
                    role="group"
                >
                    <button
                        :disabled="disabled"
                        class="btn btn-sm btn-outline-danger"
                        type="button"
                        @click="deleteRecipe"
                    >
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button
                        :disabled="disabled"
                        class="btn btn-sm btn-outline-primary"
                        type="button"
                        @click="$emit('edit', recipe)"
                    >
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
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
        }
    }
};
</script>