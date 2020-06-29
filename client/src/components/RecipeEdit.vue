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
                v-if="showError"
                class="btn btn-link text-danger float-right m-1 my-2"
                disabled
                type="button"
            >Error</button>
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
                    :class="{'is-invalid': errors.title}"
                    id="title"
                    type="text"
                    class="form-control"
                    placeholder="Recipe Title"
                    v-model="editing.title"
                    maxlength="64"
                />
                <small class="w-75 invalid-feedback float-left">{{errors.title}}</small>
                <small class="form-text text-muted float-right">{{editing.title.length}}/64</small>
            </div>
            <div class="col-2">
                <label for="servingCount">Servings</label>
                <input
                    :class="{'is-invalid': errors.serving.count}"
                    class="form-control"
                    type="number"
                    id="servingCount"
                    min="1"
                    step="1"
                    v-model="editing.serving.count"
                />
                <small class="invalid-feedback">{{errors.serving.count}}</small>
            </div>
            <div class="col-3">
                <label for="servingSize">Serving Size</label>
                <div class="input-group">
                    <input
                        :class="{'is-invalid': errors.serving.size}"
                        type="number"
                        id="servingSize"
                        class="form-control"
                        min="1"
                        step="0.25"
                        v-model="editing.serving.size"
                    />
                    <select
                        :class="{'is-invalid': errors.serving.units}"
                        class="custom-select"
                        v-model="editing.serving.units"
                    >
                        <option :value="undefined">- Units -</option>
                        <option
                            v-for="({singular, plural}, index) in allUnits"
                            :key="index"
                            :value="singular"
                        >{{editing.serving.size > 1 ? plural : singular}}</option>
                    </select>
                    <small class="invalid-feedback">
                        <span class="w-50 float-left">{{errors.serving.size}}</span>
                        <span class="w-50 float-right">{{errors.serving.units}}</span>
                    </small>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="col">
                <label for="description">Description</label>
                <textarea
                    :class="{'is-invalid': errors.description}"
                    v-model="editing.description"
                    maxlength="1024"
                    id="description"
                    type="text"
                    class="form-control"
                    placeholder="Enter description..."
                ></textarea>
                <small class="invalid-feedback w-75 float-left">{{errors.description}}</small>
                <small class="form-text text-muted float-right">{{editing.description.length}}/1024</small>
            </div>
        </div>

        <h4 class="pt-2">
            Image
            <button
                v-if="errors.image"
                class="btn btn-link text-danger"
                disabled
                type="button"
            >{{errors.image}}</button>
        </h4>
        <ul class="list-group">
            <li class="list-group-item list-group-item-action">
                <div class="input-group">
                    <div class="custom-file">
                        <input
                            :class="{'is-invalid': errors.image}"
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

        <h4 class="pt-3">
            Ingredients
            <button
                v-if="errors.ingredients"
                class="btn btn-link text-danger"
                disabled
                type="button"
            >{{errors.ingredients}}</button>
        </h4>
        <ul class="list-group">
            <li
                class="list-group-item list-group-item-action"
                v-for="({amount, units, name}, index) in editing.ingredients"
                :key="index"
            >
                <div class="input-group">
                    <input
                        :class="{'is-invalid': errors.ingredient[index] && errors.ingredient[index].amount}"
                        type="number"
                        class="form-control"
                        v-model="editing.ingredients[index].amount"
                        min="0.25"
                        step="0.25"
                    />
                    <select
                        class="custom-select"
                        v-model="editing.ingredients[index].units"
                        :class="{'is-invalid': errors.ingredient[index] && errors.ingredient[index].units}"
                    >
                        <option :value="undefined">- Units -</option>
                        <option
                            v-for="({singular, plural}, index1) in allUnits"
                            :key="index1"
                            :value="singular"
                        >{{editing.ingredients[index].amount > 1 ? plural : singular}}</option>
                    </select>
                    <input
                        :class="{'is-invalid': errors.ingredient[index] && errors.ingredient[index].name}"
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
                    class="float-left text-danger"
                    style="width: 90%;"
                    v-if="errors.ingredient[index]"
                >
                    <span
                        style="width: 35%;"
                        class="d-inline-block"
                    >{{errors.ingredient[index].amount}}</span>
                    <span
                        style="width: 35%;"
                        class="d-inline-block"
                    >{{errors.ingredient[index].units}}</span>
                    <span class="d-inline-block">{{errors.ingredient[index].name}}</span>
                </small>
                <small
                    class="form-text text-muted float-right mr-5 pr-4"
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

        <h4 class="pt-3">
            Steps
            <button
                v-if="errors.steps"
                class="btn btn-link text-danger"
                disabled
                type="button"
            >{{errors.steps}}</button>
        </h4>
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
                        :class="{'is-invalid': errors.step[index]}"
                        type="text"
                        class="form-control"
                        v-model="editing.steps[index]"
                        maxlength="128"
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
                    class="float-left text-danger"
                    v-if="errors.step[index]"
                >{{errors.step[index]}}</small>
                <small
                    class="form-text text-muted float-right mr-5 pr-4"
                >{{editing.steps[index].length}}/128</small>
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

import { createRecipe, editRecipe } from "../services/RecipeService";

export default {
    name: "RecipeEdit",
    props: ["recipe"],
    data() {
        return {
            editing: null,
            allUnits: Unit.list(),
            showSaved: false,
            showSaving: false,
            showError: false,
            errors: null
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
            this.clearErrors();
            this.showSaving = true;
            if (this.editing._id) {
                // Send request to edit recipe
                editRecipe(this.editing)
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
                            case 422:
                                this.fillErrors(data);
                                break;
                            default:
                                this.showError = true;
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
                // Send request to create recipe
                console.log(this.editing);
                createRecipe(this.editing)
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
                            case 422:
                                this.fillErrors(data);
                                break;
                            default:
                                this.showError = true;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.$parent.$parent._500();
                    });
            }
        },
        fillErrors({ errors }) {
            this.showSaving = false;
            this.showError = true;
            errors.forEach(({ param, msg }) => {
                let match = [];
                if (param === "title") this.errors.title = msg;
                else if (param === "serving.count")
                    this.errors.serving.count = msg;
                else if (param === "serving.size")
                    this.errors.serving.size = msg;
                else if (param === "serving.units")
                    this.errors.serving.units = msg;
                else if (param === "description") this.errors.description = msg;
                else if (param === "image") this.errors.image = msg;
                else if (param === "ingredients") this.errors.ingredients = msg;
                else if (
                    (match = /^ingredients\[([0-9]+)\]\.amount/.exec(param))
                ) {
                    if (!this.errors.ingredient[+match[1]])
                        this.errors.ingredient[+match[1]] = {};
                    this.errors.ingredient[+match[1]].amount = msg;
                } else if (
                    (match = /^ingredients\[([0-9]+)\]\.units/.exec(param))
                ) {
                    if (!this.errors.ingredient[+match[1]])
                        this.errors.ingredient[+match[1]] = {};
                    this.errors.ingredient[+match[1]].units = msg;
                } else if (
                    (match = /^ingredients\[([0-9]+)\]\.name/.exec(param))
                ) {
                    if (!this.errors.ingredient[+match[1]])
                        this.errors.ingredient[+match[1]] = {};
                    this.errors.ingredient[+match[1]].name = msg;
                } else if (param === "steps") {
                    this.errors.steps = msg;
                } else if ((match = /^steps\[([0-9]+)\]/.exec(param))) {
                    this.errors.step[+match[1]] = msg;
                }
            });
        },
        clearErrors() {
            this.showError = false;
            this.errors = {
                title: undefined,
                serving: {
                    count: undefined,
                    size: undefined,
                    units: undefined
                },
                description: undefined,
                image: undefined,
                ingredients: undefined,
                ingredient: [], // {name, amount, units}
                steps: undefined,
                step: []
            };
        }
    },
    created() {
        this.editing = {
            ...this.recipe,
            ingredients: [...this.recipe.ingredients],
            steps: [...this.recipe.steps]
        };
        this.clearErrors();
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