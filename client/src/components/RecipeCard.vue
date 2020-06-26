<template>
    <div class="card">
        <img v-if="recipe.image" :src="recipe.image" class="card-img-top" />
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
            <div class="btn-toolbar justify-content-between flex-row-reverse" role="toolbar">
                <div class="btn-group" role="group">
                    <a
                        @click.prevent
                        class="btn btn-sm btn-outline-primary"
                        role="button"
                        target="_blank"
                        :href="`/pdf/${recipe._id}`"
                    >
                        <i class="fas fa-print"></i>
                    </a>
                    <button
                        @click="$emit('favorite', recipe)"
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
                        class="btn btn-sm btn-outline-danger"
                        type="button"
                        @click="$emit('delete', recipe)"
                    >
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button
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
export default {
    name: "RecipeCard",
    props: ["recipe"],
    methods: {
        isFavorite() {
            const id = this.recipe._id;
            return this.$parent.$parent.user.favorites.some(r => r === id);
        }
    }
};
</script>