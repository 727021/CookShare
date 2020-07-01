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
            <b-btn variant="outline-danger" class="float-right m-1 my-2" @click="$emit('close')">
                <fa-icon icon="times" />
            </b-btn>
            <b-btn
                variant="outline-primary"
                class="float-right m-1 my-2"
                :href="`/pdf/${recipe._id}?access_token=${token()}`"
                target="_blank"
            >
                <fa-icon icon="print" />
            </b-btn>
        </h1>
        <b-select
            class="float-right"
            style="width: 5rem;"
            v-model="multiplier"
            :options="[{value: .25, text: 'x0.25', disabled: recipe.serving.count * 0.25 < 1},{value: .5, text: 'x0.5', disabled: recipe.serving.count * 0.5 < 1},{value: 1, text: 'x1'},{value: 2, text: 'x2'},{value: 3, text: 'x3'},]"
        ></b-select>
        <b-textarea
            readonly
            plaintext
            no-resize
            v-model="recipe.description"
            class="w-75 py-0 ml-3"
        ></b-textarea>

        <b-carousel v-if="recipe.image" class="bg-dark py-2 text-center rounded">
            <b-carousel-slide>
                <template v-slot:img>
                    <img :src="recipe.image" class="rounded" style="height: 20rem;" />
                </template>
            </b-carousel-slide>
        </b-carousel>

        <h4 class="pt-3">Ingredients</h4>
        <b-list-group>
            <b-list-group-item
                v-for="({amount, units, name}, index) in recipe.ingredients"
                :key="index"
            >{{amount * multiplier}} {{!units || !getFullUnit(units) ? '' : getFullUnit(units).abbr}} {{name}}</b-list-group-item>
        </b-list-group>

        <h4 class="pt-3">Steps</h4>
        <b-list-group>
            <b-list-group-item v-for="(step, index) in recipe.steps" :key="index">
                <b>{{index + 1}}.</b>
                {{step}}
            </b-list-group-item>
        </b-list-group>
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
        getFullUnit: unit => Unit.find(unit),
        token: () => localStorage.getItem("token")
    }
};
</script>

<style scoped>
/* .carousel-item > img {
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
} */
</style>
