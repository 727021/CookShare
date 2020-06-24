<template>
    <div class="card" :data-recipe="recipe._id">
        <img v-if="recipe.images.length > 0" :src="recipe.images[0]" class="card-img-top" />
        <div class="card-body">
            <h5 class="card-title">
                <button
                    class="btn btn-lg btn-link p-0"
                    @click.prevent="$emit('view', recipe)"
                >{{recipe.title}}</button>
            </h5>
            <p class="card-text">{{recipe.description}}</p>
        </div>
        <div class="card-footer">
            <button
                v-if="recipe.author === this.$parent.$parent.user._id"
                @click="$emit('edit', recipe)"
                class="btn btn-sm btn-outline-primary"
                type="button"
            >
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button
                @click="$emit('favorite', recipe)"
                class="btn btn-sm btn-outline-danger float-right"
                type="button"
            >
                <i :class="{'fas': isFavorite(), 'far': !isFavorite()}" class="fa-heart"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "RecipeCard",
    params: ["recipe"],
    data() {
        return {
            recipe: null
        };
    },
    methods: {
        isFavorite() {
            return (
                this.$parent.$parent.user.favorites.findIndex(
                    r => r === this.recipe._id
                ) >= 0
            );
        }
    },
    created() {
        this.recipe = this.$attrs.recipe;
    }
};
</script>