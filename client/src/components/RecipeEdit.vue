<template>
    <div>
        <h1 class="border-bottom border-secondary">
            Editing {{ editing.title || "Recipe" }}
            <b-btn
                variant="outline-danger"
                class="float-right m-1 my-2"
                @click="$emit('close')"
            >
                <fa-icon icon="times" />
            </b-btn>
            <b-btn
                variant="outline-success"
                class="float-right m-1 my-2"
                @click="save"
            >
                <fa-icon icon="save" />
            </b-btn>
            <b-btn
                v-if="showSaved"
                variant="link"
                class="text-success float-right m-1 my-2"
                disabled
                >Saved</b-btn
            >
            <b-btn
                v-if="showError"
                variant="link"
                class="text-danger float-right m-1 my-2"
                disabled
                >Error</b-btn
            >
            <b-btn
                v-if="showSaving"
                variant="link"
                class="text-success float-right m-1 my-2"
                disabled
                type="button"
                >Saving...</b-btn
            >
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
                        <span class="float-left">{{ errors.title }}</span>
                    </template>
                    <template v-slot:description>
                        <span class="float-right"
                            >{{ editing.title.length }}/64</span
                        >
                    </template>
                </b-form-group>
            </b-col>
            <b-col cols="2">
                <b-form-group
                    class="m-0"
                    label="Servings"
                    :invalid-feedback="errors.serving.count"
                >
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
                    :state="
                        errors.serving.size || errors.serving.units
                            ? false
                            : null
                    "
                >
                    <template v-slot:invalid-feedback>
                        <span class="w-50 float-left">{{
                            errors.serving.size
                        }}</span>
                        <span class="w-50 float-right">{{
                            errors.serving.units
                        }}</span>
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
                            :text-field="
                                editing.serving.size > 1 ? 'plural' : 'singular'
                            "
                        >
                            <template v-slot:first>
                                <b-select-option :value="undefined"
                                    >-- Units --</b-select-option
                                >
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
                        <span class="float-left">{{ errors.description }}</span>
                    </template>
                    <template v-slot:description>
                        <span class="float-right"
                            >{{ editing.description.length }}/1024</span
                        >
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
            <b-btn
                v-if="errors.image"
                variant="link"
                class="text-danger"
                disabled
                >{{ errors.image }}</b-btn
            >
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
                        <b-btn
                            variant="outline-danger"
                            @click="
                                newImage = null;
                                previewImage();
                            "
                        >
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
                >{{ errors.ingredients }}</b-btn
            >
        </h4>
        <b-list-group>
            <b-list-group-item
                v-for="(value, index) in editing.ingredients"
                :key="index"
            >
                <b-form-group
                    class="m-0"
                    :state="
                        errors.ingredients ||
                        (errors.ingredient.length > 0 &&
                            errors.ingredient.some(
                                i =>
                                    Boolean(i.amount) ||
                                    Boolean(i.units) ||
                                    Boolean(i.name)
                            ))
                            ? false
                            : null
                    "
                >
                    <template v-slot:invalid-feedback>
                        <span class="float-left">
                            <span class="pr-2">{{
                                errors.ingredient[index]
                                    ? errors.ingredient[index].amount
                                    : ""
                            }}</span>
                            <span class="pr-2">{{
                                errors.ingredient[index]
                                    ? errors.ingredient[index].units
                                    : ""
                            }}</span>
                            <span class="pr-2">{{
                                errors.ingredient[index]
                                    ? errors.ingredient[index].name
                                    : ""
                            }}</span>
                        </span>
                    </template>
                    <template v-slot:description>
                        <span class="float-right mr-5 pr-4"
                            >{{
                                editing.ingredients[index].name.length
                            }}/64</span
                        >
                    </template>
                    <b-input-group>
                        <b-input
                            placeholder="Amount"
                            type="number"
                            min="0.25"
                            step="0.25"
                            :state="
                                errors.ingredient[index] &&
                                errors.ingredient[index].amount
                                    ? false
                                    : null
                            "
                            v-model="editing.ingredients[index].amount"
                        ></b-input>
                        <b-select
                            v-model="editing.ingredients[index].units"
                            :state="
                                errors.ingredient[index] &&
                                errors.ingredient[index].units
                                    ? false
                                    : null
                            "
                            :options="allUnits"
                            value-field="singular"
                            :text-field="
                                editing.ingredients[index].amount > 1
                                    ? 'plural'
                                    : 'singular'
                            "
                        >
                            <template v-slot:first>
                                <b-select-option :value="undefined"
                                    >-- Units --</b-select-option
                                >
                            </template>
                        </b-select>
                        <b-input
                            placeholder="Ingredient"
                            maxlength="64"
                            :state="
                                errors.ingredient[index] &&
                                errors.ingredient[index].name
                                    ? false
                                    : null
                            "
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
                                    :disabled="
                                        index === editing.ingredients.length - 1
                                    "
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
                <b-btn variant="outline-success" block @click="addIngredient"
                    >Add Ingredient</b-btn
                >
            </b-list-group-item>
        </b-list-group>
        <h4 class="pt-3">
            Steps
            <b-btn v-if="errors.steps" variant="link" class="text-danger">{{
                errors.steps
            }}</b-btn>
        </h4>
        <b-list-group>
            <b-list-group-item
                v-for="(value, index) in editing.steps"
                :key="index"
            >
                <b-form-group
                    class="m-0"
                    :state="
                        errors.steps ||
                        (errors.step.length > 0 &&
                            errors.step.some(s => Boolean(s)))
                            ? false
                            : null
                    "
                >
                    <template v-slot:invalid-feedback>
                        <span class="float-left">{{
                            errors.step[index] ? errors.step[index] : ""
                        }}</span>
                    </template>
                    <template v-slot:description>
                        <span class="float-right mr-5 pr-4"
                            >{{ editing.steps[index].length }}/128</span
                        >
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
                                    :disabled="
                                        index === editing.steps.length - 1
                                    "
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
                <b-btn variant="outline-success" block @click="addStep"
                    >Add Step</b-btn
                >
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import { createRecipe, editRecipe } from "../services/RecipeService";

import { Unit } from "../util/units";
import { SUCCESS, CREATED, AUTH_ERROR, DATA_ERROR } from "../util/status-codes";

export default {
    name: "RecipeEdit",
    props: ["recipe", "recipes"],
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
                name: "",
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
            this.editing.steps.push("");
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
                            case SUCCESS:
                                // Update local recipe with result
                                this.recipes[
                                    this.recipes.findIndex(
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
                            case AUTH_ERROR:
                                this.$emit("401");
                                break;
                            case DATA_ERROR:
                                this.fillErrors(data);
                                break;
                            default:
                                this.showError = true;
                        }
                    })
                    .catch(err => {
                        this.$emit("500", err);
                    })
                    .finally(() => {
                        this.showSaving = false;
                    });
            } else {
                // Send request to create recipe
                createRecipe(this.editing)
                    .then(({ status, data }) => {
                        switch (status) {
                            case CREATED:
                                // Push result onto local recipe list
                                this.recipes.push({
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
                            case AUTH_ERROR:
                                this.$emit("401");
                                break;
                            case DATA_ERROR:
                                this.fillErrors(data);
                                break;
                            default:
                                this.showError = true;
                        }
                    })
                    .catch(err => {
                        this.$emit("500", err);
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