<template>
    <div>
        <h1 class="border-bottom border-secondary">
            Editing {{editing.title}}
            <b-btn variant="outline-danger" class="float-right m-1 my-2" @click="$emit('close')">
                <fa-icon icon="times" />
            </b-btn>
            <b-btn variant="outline-success" class="float-right m-1 my-2" @click="save">
                <fa-icon icon="save" />
            </b-btn>
            <b-btn
                v-if="showSaved"
                variant="link"
                class="text-success float-right m-1 my-2"
                disabled
            >Saved</b-btn>
            <b-btn
                v-if="showError"
                variant="link"
                class="text-danger float-right m-1 my-2"
                disabled
            >Error</b-btn>
            <b-btn
                v-if="showSaving"
                variant="link"
                class="text-success float-right m-1 my-2"
                disabled
                type="button"
            >Saving...</b-btn>
        </h1>

        <b-form-row>
            <b-col cols="7">
                <b-form-group class="m-0" label="Recipe Title">
                    <b-input
                        placeholder="Recipe Title"
                        :state="errors.title ? false : null"
                        v-model="editing.title"
                        maxlength="64"
                    ></b-input>
                    <template v-slot:invalid-feedback>
                        <span class="float-left">{{errors.title}}</span>
                    </template>
                    <template v-slot:description>
                        <span class="float-right">{{editing.title.length}}/64</span>
                    </template>
                </b-form-group>
            </b-col>
            <b-col cols="2">
                <b-form-group class="m-0" label="Servings" :invalid-feedback="errors.serving.count">
                    <b-input
                        type="number"
                        min="1"
                        step="1"
                        v-model="editing.serving.count"
                        :state="errors.serving.count ? false : null"
                    ></b-input>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    class="m-0"
                    label="Serving Size"
                    :state="errors.serving.size || errors.serving.units ? false : null"
                >
                    <template v-slot:invalid-feedback>
                        <span class="w-50 float-left">{{errors.serving.size}}</span>
                        <span class="w-50 float-right">{{errors.serving.units}}</span>
                    </template>
                    <b-input-group>
                        <b-input
                            type="number"
                            min="1"
                            step="0.25"
                            v-model="editing.serving.size"
                            :state="errors.serving.size ? false : null"
                        ></b-input>
                        <b-select
                            v-model="editing.serving.units"
                            :state="errors.serving.units ? false : null"
                            :options="allUnits"
                            value-field="singular"
                            :text-field="editing.serving.size > 1 ? 'plural' : 'singular'"
                        >
                            <template v-slot:first>
                                <b-select-option :value="undefined">-- Units --</b-select-option>
                            </template>
                        </b-select>
                    </b-input-group>
                </b-form-group>
            </b-col>
        </b-form-row>
        <b-form-row>
            <b-col>
                <b-form-group class="m-0" label="Description">
                    <template v-slot:invalid-feedback>
                        <span class="float-left">{{errors.description}}</span>
                    </template>
                    <template v-slot:description>
                        <span class="float-right">{{editing.description.length}}/1024</span>
                    </template>
                    <b-textarea
                        v-model="editing.description"
                        :state="errors.description ? false : null"
                        placeholder="Enter description..."
                        maxlength="1024"
                    ></b-textarea>
                </b-form-group>
            </b-col>
        </b-form-row>
        <h4>
            Image
            <b-btn v-if="errors.image" variant="link" class="text-danger" disabled>{{errors.image}}</b-btn>
        </h4>
        <b-list-group>
            <b-list-group-item>
                <b-input-group>
                    <b-form-file
                        placeholder="Choose an image..."
                        @input="previewImage"
                        :state="errors.image ? false : null"
                        v-model="newImage"
                        accept="image/jpg, image/jpeg, image/png"
                    ></b-form-file>
                    <template v-slot:append>
                        <b-btn variant="outline-danger" @click="newImage = null; previewImage()">
                            <fa-icon icon="trash-alt" />
                        </b-btn>
                    </template>
                </b-input-group>
            </b-list-group-item>
            <b-list-group-item v-if="editing.image">
                <b-carousel class="bg-dark py-2 text-center rounded">
                    <b-carousel-slide>
                        <template v-slot:img>
                            <img
                                :src="imagePreview || editing.image"
                                class="rounded"
                                style="height: 20rem;"
                            />
                        </template>
                    </b-carousel-slide>
                </b-carousel>
            </b-list-group-item>
        </b-list-group>
        <h4 class="pt-3">
            Ingredients
            <b-btn
                v-if="errors.ingredients"
                variant="link"
                class="text-danger"
            >{{errors.ingredients}}</b-btn>
        </h4>
        <b-list-group>
            <b-list-group-item v-for="(value, index) in editing.ingredients" :key="index">
                <b-form-group
                    class="m-0"
                    :state="errors.ingredients || errors.ingredient.length > 0 && errors.ingredient.some(i => Boolean(i.amount) || Boolean(i.units) || Boolean(i.name)) ? false : null"
                >
                    <template v-slot:invalid-feedback>
                        <span class="float-left">
                            <span
                                class="pr-2"
                            >{{errors.ingredient[index] ? errors.ingredient[index].amount : ''}}</span>
                            <span
                                class="pr-2"
                            >{{errors.ingredient[index] ? errors.ingredient[index].units : ''}}</span>
                            <span
                                class="pr-2"
                            >{{errors.ingredient[index] ? errors.ingredient[index].name : ''}}</span>
                        </span>
                    </template>
                    <template v-slot:description>
                        <span
                            class="float-right mr-5 pr-4"
                        >{{editing.ingredients[index].name.length}}/64</span>
                    </template>
                    <b-input-group>
                        <b-input
                            placeholder="Amount"
                            type="number"
                            min="0.25"
                            step="0.25"
                            :state="errors.ingredient[index] && errors.ingredient[index].amount ? false : null"
                            v-model="editing.ingredients[index].amount"
                        ></b-input>
                        <b-select
                            v-model="editing.ingredients[index].units"
                            :state="errors.ingredient[index] && errors.ingredient[index].units ? false : null"
                            :options="allUnits"
                            value-field="singular"
                            :text-field="editing.ingredients[index].amount > 1 ? 'plural' : 'singular'"
                        >
                            <template v-slot:first>
                                <b-select-option :value="undefined">-- Units --</b-select-option>
                            </template>
                        </b-select>
                        <b-input
                            placeholder="Name"
                            maxlength="64"
                            :state="errors.ingredient[index] && errors.ingredient[index].name ? false : null"
                            v-model="editing.ingredients[index].name"
                        ></b-input>
                        <template v-slot:append>
                            <b-btn
                                variant="outline-danger"
                                :disabled="editing.ingredients.length === 1"
                                @click="removeIngredient(index)"
                            >
                                <fa-icon icon="trash-alt" />
                            </b-btn>
                            <b-dropdown variant="outline-secondary">
                                <b-dropdown-item
                                    :disabled="index === 0"
                                    @click="moveIngredient(index, 'up')"
                                >
                                    <fa-icon icon="angle-up" />Move Up
                                </b-dropdown-item>
                                <b-dropdown-item
                                    :disabled="index === editing.ingredients.length - 1"
                                    @click="moveIngredient(index, 'down')"
                                >
                                    <fa-icon icon="angle-down" />Move Down
                                </b-dropdown-item>
                            </b-dropdown>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-list-group-item>
            <b-list-group-item>
                <b-btn variant="outline-success" block @click="addIngredient">Add Ingredient</b-btn>
            </b-list-group-item>
        </b-list-group>
        <h4 class="pt-3">
            Steps
            <b-btn v-if="errors.steps" variant="link" class="text-danger">{{errors.steps}}</b-btn>
        </h4>
        <b-list-group>
            <b-list-group-item v-for="(value, index) in editing.steps" :key="index">
                <b-form-group
                    class="m-0"
                    :state="errors.steps || errors.step.length > 0 && errors.step.some(s => Boolean(s)) ? false : null"
                >
                    <template v-slot:invalid-feedback>
                        <span class="float-left">{{errors.step[index] ? errors.step[index] : ''}}</span>
                    </template>
                    <template v-slot:description>
                        <span class="float-right mr-5 pr-4">{{editing.steps[index].length}}/128</span>
                    </template>
                    <b-input-group :prepend="`${index + 1}.`">
                        <b-input
                            :placeholder="`Step ${index + 1}`"
                            maxlength="128"
                            v-model="editing.steps[index]"
                            :state="errors.step[index] ? false : null"
                        ></b-input>
                        <template v-slot:append>
                            <b-btn
                                variant="outline-danger"
                                :disabled="editing.steps.length === 1"
                                @click="removeStep(index)"
                            >
                                <fa-icon icon="trash-alt" />
                            </b-btn>
                            <b-dropdown variant="outline-secondary">
                                <b-dropdown-item
                                    :disabled="index === 0"
                                    @click="moveStep(index, 'up')"
                                >
                                    <fa-icon icon="angle-up" />Move Up
                                </b-dropdown-item>
                                <b-dropdown-item
                                    :disabled="index === editing.steps.length - 1"
                                    @click="moveStep(index, 'down')"
                                >
                                    <fa-icon icon="angle-down" />Move Down
                                </b-dropdown-item>
                            </b-dropdown>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-list-group-item>
            <b-list-group-item>
                <b-btn variant="outline-success" block @click="addStep">Add Step</b-btn>
            </b-list-group-item>
        </b-list-group>

        <!--
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
                        <button
                            class="btn btn-outline-danger"
                            type="button"
                            @click="editing.image = undefined"
                        >
                            <fa-icon icon="trash-alt" />
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
                            <fa-icon icon="trash-alt" />
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
                                <fa-icon icon="angle-up" />Move Up
                            </button>
                            <button
                                :disabled="index === editing.ingredients.length - 1"
                                @click.prevent="moveIngredient(index, 'down')"
                                class="dropdown-item"
                            >
                                <fa-icon icon="angle-down" />Move Down
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
                            <fa-icon icon="trash-alt" />
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
                                <fa-icon icon="angle-up" />Move Up
                            </button>
                            <button
                                :disabled="index === editing.steps.length - 1"
                                @click.prevent="moveStep(index, 'down')"
                                class="dropdown-item"
                            >
                                <fa-icon icon="angle-down" />Move Down
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
        </ol>-->
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
            newImage: null,
            imagePreview: null,
            allUnits: Unit.list(),
            showSaved: false,
            showSaving: false,
            showError: false,
            errors: null,
            imgChanged: false
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
        previewImage(file) {
            this.editing.changeImage = true;
            if (this.newImage) {
                this.imagePreview = URL.createObjectURL(file);
                this.editing.image = file;
            } else {
                URL.revokeObjectURL(this.imagePreview);
                this.imagePreview = null;
                this.editing.image = null;
            }
        },
        save() {
            this.clearErrors();
            this.showSaving = true;
            if (this.editing.changeImage) this.editing.image = this.newImage;
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
                                    steps: [...data.steps],
                                    changeImage: false
                                };
                                this.showSaving = false;
                                this.showSaved = true;
                                this.imgChanged = false;
                                this.imagePreview = this.editing.image;
                                setTimeout(
                                    () => (this.showSaved = false),
                                    3000
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
                                    steps: [...data.steps],
                                    changeImage: false
                                };
                                this.showSaving = false;
                                this.showSaved = true;
                                this.imgChanged = false;
                                this.imagePreview = this.editing.image;
                                setTimeout(
                                    () => (this.showSaved = false),
                                    3000
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
            steps: [...this.recipe.steps],
            changeImage: false
        };
        this.imagePreview = this.editing.image || null;
        this.clearErrors();
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
} */
</style>