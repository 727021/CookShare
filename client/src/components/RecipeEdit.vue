<template>
    <div>
        <h1 class="border-bottom border-secondary">
            Editing {{editing.title}}
            <button
                class="btn btn-outline-danger float-right m-1 my-2"
                type="button"
                @click="$emit('close')"
            >
                <i class="fas fa-times"></i>
            </button>
            <button
                class="btn btn-outline-success float-right m-1 my-2"
                type="button"
                @click="save"
            >
                <i class="fas fa-save"></i>
            </button>
            <button
                v-if="showSaved"
                class="btn btn-link text-success float-right m-1 my-2"
                disabled
                type="button"
            >Saved</button>
            <button
                v-if="showSaving"
                class="btn btn-link text-success float-right m-1 my-2"
                disabled
                type="button"
            >Saving...</button>
        </h1>
        <div class="form-row">
            <div class="col-7">
                <label for="title">Recipe Title</label>
                <input
                    id="title"
                    type="text"
                    class="form-control"
                    placeholder="Recipe Title"
                    v-model="editing.title"
                    maxlength="64"
                />
                <small class="form-text text-muted text-right">{{editing.title.length}}/64</small>
            </div>
            <div class="col-2">
                <label for="servingCount">Servings</label>
                <input
                    class="form-control"
                    type="number"
                    id="servingCount"
                    min="1"
                    step="1"
                    v-model="editing.serving.count"
                />
            </div>
            <div class="col-3">
                <label for="servingSize">Serving Size</label>
                <div class="input-group">
                    <input
                        type="number"
                        id="servingSize"
                        class="form-control"
                        min="1"
                        step="0.25"
                        v-model="editing.serving.size"
                    />
                    <select class="custom-select" v-model="editing.serving.units">
                        <option :value="undefined">- Units -</option>
                        <option
                            v-for="({singular, plural}, index) in allUnits"
                            :key="index"
                            :value="singular"
                        >{{editing.serving.size > 1 ? plural : singular}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="col">
                <label for="description">Description</label>
                <textarea
                    v-model="editing.description"
                    maxlength="1024"
                    id="description"
                    type="text"
                    class="form-control"
                ></textarea>
                <small class="form-text text-muted text-right">{{editing.description.length}}/1024</small>
            </div>
        </div>

        <h4 class="pt-2">Image</h4>
        <ul class="list-group">
            <li class="list-group-item list-group-item-action">
                <div class="input-group">
                    <div class="custom-file">
                        <input
                            type="file"
                            id="addFile"
                            class="custom-file-input"
                            @change="addImage($event)"
                            accept="image/png, image/jpg, image/jpeg"
                        />
                        <label for="addFile" class="custom-file-label">Choose file...</label>
                    </div>
                    <div class="input-group-append">
                        <button class="btn btn-outline-danger" type="button" @click="removeImage">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </li>
            <li v-if="editing.image" class="list-group-item list-group-item-action">
                <div
                    id="recipeCarousel"
                    class="carousel slide bg-dark py-2"
                    data-ride="carousel"
                    data-interval="false"
                >
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img :src="editing.image" class="d-block mx-auto rounded" />
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <h4 class="pt-3">Ingredients</h4>
        <ul class="list-group">
            <li
                class="list-group-item list-group-item-action"
                v-for="({amount, units, name}, index) in editing.ingredients"
                :key="index"
            >
                <div class="input-group">
                    <input
                        type="number"
                        class="form-control"
                        v-model="editing.ingredients[index].amount"
                        min="0.25"
                        step="0.25"
                    />
                    <select class="custom-select" v-model="editing.ingredients[index].units">
                        <option :value="undefined">- Units -</option>
                        <option
                            v-for="({singular, plural}, index1) in allUnits"
                            :key="index1"
                            :value="singular"
                        >{{editing.ingredients[index].amount > 1 ? plural : singular}}</option>
                    </select>
                    <input
                        type="text"
                        class="form-control"
                        v-model="editing.ingredients[index].name"
                        maxlength="64"
                    />
                    <div class="input-group-append">
                        <button
                            class="btn btn-outline-danger"
                            :disabled="editing.ingredients.length === 1"
                            type="button"
                            @click="removeIngredient(index)"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button
                            class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                            data-toggle="dropdown"
                            type="button"
                        ></button>
                        <div class="dropdown-menu">
                            <button
                                :disabled="index === 0"
                                @click.prevent="moveIngredient(index, 'up')"
                                class="dropdown-item"
                            >
                                <i class="fas fa-angle-up"></i> Move Up
                            </button>
                            <button
                                :disabled="index === editing.ingredients.length - 1"
                                @click.prevent="moveIngredient(index, 'down')"
                                class="dropdown-item"
                            >
                                <i class="fas fa-angle-down"></i> Move Down
                            </button>
                        </div>
                    </div>
                </div>
                <small
                    class="form-text text-muted text-right mr-5 pr-4"
                >{{editing.ingredients[index].name.length}}/64</small>
            </li>
            <li class="list-group-item list-group-item-action">
                <button
                    class="btn btn-outline-success w-100"
                    type="button"
                    @click="addIngredient"
                >Add Ingredient</button>
            </li>
        </ul>

        <h4 class="pt-3">Steps</h4>
        <ol class="list-group">
            <li
                class="list-group-item list-group-item-action"
                v-for="(value, index) in editing.steps"
                :key="index"
            >
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">{{index + 1}}.</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        v-model="editing.steps[index]"
                        maxlength="64"
                    />
                    <div class="input-group-append">
                        <button
                            class="btn btn-outline-danger"
                            :disabled="editing.steps.length === 1"
                            type="button"
                            @click="removeStep(index)"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button
                            class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                            data-toggle="dropdown"
                            type="button"
                        ></button>
                        <div class="dropdown-menu">
                            <button
                                :disabled="index === 0"
                                @click.prevent="moveStep(index, 'up')"
                                class="dropdown-item"
                            >
                                <i class="fas fa-angle-up"></i> Move Up
                            </button>
                            <button
                                :disabled="index === editing.steps.length - 1"
                                @click.prevent="moveStep(index, 'down')"
                                class="dropdown-item"
                            >
                                <i class="fas fa-angle-down"></i> Move Down
                            </button>
                        </div>
                    </div>
                </div>
                <small
                    class="form-text text-muted text-right mr-5 pr-4"
                >{{editing.steps[index].length}}/64</small>
            </li>
            <li class="list-group-item list-group-item-action">
                <button
                    class="btn btn-outline-success w-100"
                    type="button"
                    @click="addStep"
                >Add Step</button>
            </li>
        </ol>
    </div>
</template>

<script>
import { Unit } from "../util/units";

import RecipeService from "../services/RecipeService";

export default {
    name: "RecipeEdit",
    props: ["recipe"],
    data() {
        return {
            editing: null,
            allUnits: Unit.list(),
            showSaved: false,
            showSaving: false
        };
    },
    methods: {
        addIngredient() {
            this.editing.ingredients.push({
                name: "New ingredient",
                amount: 1,
                units: undefined
            });
        },
        removeIngredient(i) {
            this.editing.ingredients.splice(i, 1);
        },
        moveIngredient(i, dir) {
            if (dir !== "up" && dir !== "down") return;
            const ingredients = [...this.editing.ingredients];
            if (dir === "up") {
                const tmp = ingredients[i - 1];
                ingredients[i - 1] = ingredients[i];
                ingredients[i] = tmp;
            } else if (dir === "down") {
                const tmp = ingredients[i + 1];
                ingredients[i + 1] = ingredients[i];
                ingredients[i] = tmp;
            }
            this.editing.ingredients = ingredients;
        },
        addStep() {
            this.editing.steps.push(`Step ${this.editing.steps.length + 1}`);
        },
        removeStep(i) {
            this.editing.steps.splice(i, 1);
        },
        moveStep(i, dir) {
            if (dir !== "up" && dir !== "down") return;
            const steps = [...this.editing.steps];
            if (dir === "up") {
                const tmp = steps[i - 1];
                steps[i - 1] = steps[i];
                steps[i] = tmp;
            } else if (dir === "down") {
                const tmp = steps[i + 1];
                steps[i + 1] = steps[i];
                steps[i] = tmp;
            }
            this.editing.steps = steps;
        },
        addImage(e) {
            console.log(e.target.result);
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = re => {
                this.editing.image = re.target.result;
                e.target.value = null;
            };
        },
        removeImage() {
            this.editing.image = undefined;
        },
        save() {
            this.showSaving = true;
            if (this.editing._id) {
                // Send request to edit recipe
                RecipeService.editRecipe(this.editing)
                    .then(({ status, data }) => {
                        switch (status) {
                            case 200:
                                // Update local recipe with result
                                this.$parent.recipes[
                                    this.$parent.recipes.findIndex(
                                        r => r._id === data._id
                                    )
                                ] = {
                                    ...data,
                                    ingredients: [...data.ingredients],
                                    steps: [...data.steps]
                                };
                                // Update editing with copy of result
                                this.editing = {
                                    ...data,
                                    ingredients: [...data.ingredients],
                                    steps: [...data.steps]
                                };
                                this.showSaving = false;
                                this.showSaved = true;
                                setTimeout(
                                    () => (this.showSaved = false),
                                    5000
                                );
                                break;
                            case 401:
                                this.$parent.$parent._401();
                                break;
                            default:
                                this.$parent.$parent._500();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.$parent.$parent._500();
                    })
                    .finally(() => {
                        this.showSaving = false;
                    });
            } else {
                // Send request to edit recipe
                RecipeService.createRecipe(this.editing)
                    .then(({ status, data }) => {
                        switch (status) {
                            case 201:
                                // Push result onto local recipe list
                                this.$parent.recipes.push({
                                    ...data,
                                    ingredients: [...data.ingredients],
                                    steps: [...data.steps]
                                });
                                // Update editing with copy of result
                                this.editing = {
                                    ...data,
                                    ingredients: [...data.ingredients],
                                    steps: [...data.steps]
                                };
                                this.showSaving = false;
                                this.showSaved = true;
                                setTimeout(
                                    () => (this.showSaved = false),
                                    5000
                                );
                                break;
                            case 401:
                                this.$parent.$parent._401();
                                break;
                            default:
                                this.$parent.$parent._500();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.$parent.$parent._500();
                    });
            }
        }
    },
    created() {
        this.editing = {
            ...this.recipe,
            ingredients: [...this.recipe.ingredients],
            steps: [...this.recipe.steps]
        };
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