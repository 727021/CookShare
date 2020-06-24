<template>
    <div class="container">
        <h1 class="border-bottom border-black">
            {{mode === 'edit' ? 'Editing ' : ''}}{{currentRecipe ? currentRecipe.title : 'Recipes'}}
            <span
                v-if="loading"
                class="spinner-border m-2"
                style="border-width: 4px;"
                role="status"
            ></span>
            <small class="ml-3" v-if="mode === 'view'">
                <small>
                    <b>Servings:</b>
                    {{currentRecipe.serving.count * multiplier}} -
                    <b>Serving Size:</b>
                    {{currentRecipe.serving.size}} {{currentRecipe.serving.units}}
                </small>
            </small>
            <button
                v-if="mode"
                class="btn btn-outline-danger float-right m-1 my-2"
                type="button"
                @click="close"
            >
                <i class="fas fa-times"></i>
            </button>
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
            <!-- TODO Open a printable version in a new tab -->
            <a
                v-if="mode === 'view'"
                class="btn btn-outline-primary float-right m-1 my-2"
                role="button"
                target="_blank"
                href="#"
                @click.prevent
            >
                <i class="fas fa-print"></i>
            </a>
            <button
                v-if="mode === 'edit'"
                class="btn btn-outline-success float-right m-1 my-2"
                type="button"
                @click="save"
            >
                <i class="fas fa-save"></i>
            </button>
        </h1>

        <div v-if="mode === 'view'">
            <select class="float-right rounded" v-model="multiplier">
                <option :disabled="currentRecipe.serving.count * 0.25 < 1" value="0.25">x0.25</option>
                <option :disabled="currentRecipe.serving.count * 0.5 < 1" value="0.5">x0.5</option>
                <option value="1" selected>x1</option>
                <option value="2">x2</option>
                <option value="3">x3</option>
            </select>
            <p>{{currentRecipe.description}}</p>
            <div
                id="recipeCarousel"
                class="carousel slide bg-dark py-2"
                data-ride="carousel"
                data-interval="false"
            >
                <ol v-if="currentRecipe.images.length > 1" class="carousel-indicators">
                    <li
                        v-for="(value, index) in currentRecipe.images"
                        :key="index"
                        data-target="#recipeCarousel"
                        :data-slide-to="index"
                        :class="{'active': index === 0}"
                    ></li>
                </ol>
                <div class="carousel-inner">
                    <div
                        v-for="(value, index) in currentRecipe.images"
                        :key="index"
                        class="carousel-item"
                        :class="{'active': index === 0}"
                    >
                        <img :src="value" class="d-block mx-auto rounded" />
                    </div>
                </div>
                <a
                    v-if="currentRecipe.images.length > 1"
                    class="carousel-control-prev"
                    href="#recipeCarousel"
                    role="button"
                    data-slide="prev"
                >
                    <i class="fas fa-lg fa-chevron-left"></i>
                    <span class="sr-only">Previous</span>
                </a>
                <a
                    v-if="currentRecipe.images.length > 1"
                    class="carousel-control-next"
                    href="#recipeCarousel"
                    role="button"
                    data-slide="next"
                >
                    <i class="fas fa-lg fa-chevron-right"></i>
                    <span class="sr-only">Next</span>
                </a>
            </div>
            <h4>Ingredients</h4>
            <ul class="list-group">
                <li
                    class="list-group-item list-group-item-action"
                    v-for="{amount, units, name} in currentRecipe.ingredients"
                    :key="amount + name"
                >{{amount * multiplier}} {{!units || !getFullUnit(units) ? '' : getFullUnit(units).abbr/*amount * multiplier > 1 ? getFullUnit(units).plural : getFullUnit(units).singular*/}} {{name}}</li>
            </ul>
            <h4>Steps</h4>
            <ol class="list-group">
                <li
                    class="list-group-item list-group-item-action"
                    v-for="(value, index) in currentRecipe.steps"
                    :key="index"
                >{{index + 1}}. {{value}}</li>
            </ol>
        </div>

        <div v-else-if="mode === 'edit'">
            <label>Title</label>
            <input type="text" v-model="currentRecipe.title" class="form-control" />
        </div>

        <div v-else-if="recipes && recipes.length > 0">
            <div class="card-columns">
                <RecipeCard
                    v-for="recipe in recipes"
                    :key="recipe._id"
                    :recipe="recipe"
                    @view="openView"
                    @edit="openEdit"
                />
            </div>
        </div>

        <div v-else-if="recipes && recipes.length === 0">
            <h5 class="text-center">No recipes</h5>
        </div>
    </div>
</template>

<script>
import RecipeCard from "../components/RecipeCard";

import RecipeService from "../services/RecipeService";

import { Unit } from "../util/units";

export default {
    name: "Recipes",
    components: {
        RecipeCard
    },
    data() {
        return {
            units: null, // [{measure, system, abbr, singular, plural}]
            loading: true,
            recipes: null,
            currentRecipe: null, // Recipe object
            mode: null, // 'edit' | 'view'
            multiplier: 1
        };
    },
    methods: {
        openCreate() {
            this.mode = "edit";
            this.currentRecipe = {
                title: "New Recipe",
                description: "Enter a description...",
                serving: {
                    count: 1,
                    size: 1,
                    units: this.units[0].abbr
                },
                ingredients: [
                    {
                        name: "New ingredient",
                        amount: 1,
                        units: this.units[0].abbr
                    }
                ],
                steps: ["Step 1"],
                images: []
            };
        },
        openEdit(recipe) {
            this.mode = "edit";
            this.currentRecipe = recipe;
        },
        openView(recipe) {
            this.mode = "view";
            this.currentRecipe = recipe;
        },
        save() {
            return Promise.resolve();
        },
        close() {
            this.mode = null;
            this.currentRecipe = null;
        },
        async saveAndClose() {
            await this.save();
            this.close();
        },
        addIngredient() {
            this.currentRecipe.ingredients.push({
                name: "New ingredient",
                amount: 1,
                units: this.units[0].abbr
            });
        },
        addStep() {
            this.currentRecipe.steps.push(
                `Step ${this.currentRecipe.steps.length + 1}`
            );
        },
        removeIngredient(index) {
            this.currentRecipe.ingredients.splice(index, 1);
        },
        removeStep(index) {
            this.currentRecipe.steps.splice(index, 1);
        },
        getFullUnit(unit) {
            return Unit.find(unit);
        }
    },
    mounted() {
        RecipeService.getRecipes()
            .then(({ status, data }) => {
                switch (status) {
                    case 200:
                        console.log(data);
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
        RecipeService.getUnits()
            .then(({ status, data }) => {
                switch (status) {
                    case 200:
                        console.log("UNITS", data);
                        this.units = data;
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
</style>