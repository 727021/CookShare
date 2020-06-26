<template>
    <div>
        <h1 class="border-bottom border-secondary">
            {{recipe.title}}
            <small class="ml-3">
                <small>
                    <b>Servings:</b>
                    {{recipe.serving.count * multiplier}}
                    <b>Serving Size:</b>
                    {{recipe.serving.size}} {{recipe.serving.units}}
                </small>
            </small>
            <button
                class="btn btn-outline-danger float-right m-1 my-2"
                type="button"
                @click="$emit('close')"
            >
                <i class="fas fa-times"></i>
            </button>
            <a
                class="btn btn-outline-primary float-right m-1 my-2"
                role="button"
                target="_blank"
                :href="`/pdf/${recipe._id}`"
                @click.prevent
            >
                <i class="fas fa-print"></i>
            </a>
        </h1>
        <select class="float-right rounded" v-model="multiplier">
            <option :disabled="recipe.serving.count * 0.25 < 1" value="0.25">x0.25</option>
            <option :disabled="recipe.serving.count * 0.5 < 1" value="0.5">x0.5</option>
            <option value="1" selected>x1</option>
            <option value="2">x2</option>
            <option value="3">x3</option>
        </select>
        <textarea
            class="form-control-plaintext w-75 py-0 ml-3 description"
            readonly
            v-model="recipe.description"
        ></textarea>
        <div
            v-if="recipe.image"
            id="recipeCarousel"
            class="carousel slide bg-dark py-2 mt-2"
            data-ride="carousel"
            data-interval="false"
        >
            <!-- <ol v-if="recipe.images.length > 1" class="carousel-indicators">
                <li
                    v-for="(value, index) in recipe.images"
                    :key="index"
                    data-target="#recipeCarousel"
                    :data-slide-to="index"
                    :class="{'active': index === 0}"
                ></li>
            </ol>-->
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img :src="recipe.image" class="d-block mx-auto rounded" />
                </div>
                <!-- <div
                    v-for="(value, index) in recipe.images"
                    :key="index"
                    class="carousel-item"
                    :class="{'active': index === 0}"
                >
                    <img :src="value" class="d-block mx-auto rounded" />
                </div>-->
            </div>
            <!-- <a
                v-if="recipe.images.length > 1"
                class="carousel-control-prev"
                href="#recipeCarousel"
                role="button"
                data-slide="prev"
            >
                <i class="fas fa-lg fa-chevron-left"></i>
                <span class="sr-only">Previous</span>
            </a>
            <a
                v-if="recipe.images.length > 1"
                class="carousel-control-next"
                href="#recipeCarousel"
                role="button"
                data-slide="next"
            >
                <i class="fas fa-lg fa-chevron-right"></i>
                <span class="sr-only">Next</span>
            </a>-->
        </div>

        <h4 class="pt-3">Ingredients</h4>
        <ul class="list-group">
            <li
                class="list-group-item list-group-item-action"
                v-for="{amount, units, name} in recipe.ingredients"
                :key="amount + name"
            >{{amount * multiplier}} {{!units || !getFullUnit(units) ? '' : getFullUnit(units).abbr}} {{name}}</li>
        </ul>

        <h4 class="pt-3">Steps</h4>
        <ol class="list-group">
            <li
                class="list-group-item list-group-item-action text-wrap"
                v-for="(value, index) in recipe.steps"
                :key="index"
            ><b>{{index + 1}}.</b> {{value}}</li>
        </ol>
    </div>
</template>

<script>
import { Unit } from "../util/units";

export default {
    name: "RecipeView",
    props: ["recipe"],
    data: () => ({
        multiplier: 1
    }),
    methods: {
        getFullUnit: unit => Unit.find(unit)
    }
};
</script>

<style scoped>
.carousel-item > img {
    height: 20rem;
    width: auto;
}
.carousel-control-prev {
    background: linear-gradient(to right, black, rgba(0, 0, 0, 0));
}
.carousel-control-next {
    background: linear-gradient(to left, black, rgba(0, 0, 0, 0));
}
textarea.form-control-plaintext {
    resize: none;
    outline: none;
    cursor: default;
}
</style>
