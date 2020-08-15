<template>
    <div class="container">
        <h1 v-if="!currentCookbook" class="border-bottom">
            Cookbooks
            <b-spinner
                v-if="loading"
                class="m-2"
                style="border-width: 4px;"
            ></b-spinner>
            <b-btn
                v-else
                variant="outline-success"
                class="float-right m-1 my-2"
                v-b-tooltip.hover.left
                title="New Cookbook"
                @click="$refs.createCookbookModal.show()"
            >
                <fa-icon icon="plus" />
            </b-btn>
        </h1>

        <CreateCookbookModal
            ref="createCookbookModal"
            :cookbooks="cookbooks"
            @401="$emit('401')"
            @500="_500"
        />

        <AddRecipeModal
            ref="addRecipeModal"
            @401="$emit('401')"
            @500="_500"
            @add="doAddRecipe"
        />

        <CookbookView
            ref="cookbookView"
            v-if="currentCookbook"
            :cookbook="currentCookbook"
            :user="user"
            @401="$emit('401')"
            @500="_500"
            @close-cookbook="currentCookbook = null"
            @add-recipe="$refs.addRecipeModal.show(currentCookbook)"
            @remove-recipe="doRemoveRecipe"
        />

        <b-card-group v-else-if="cookbooks && cookbooks.length > 0" columns>
            <CookbookCard
                v-for="cookbook in cookbooks"
                :key="cookbook._id"
                :cookbook="cookbook"
                :cookbooks="cookbooks"
                :user="user"
                @open="openCookbook"
                @add="$refs.addRecipeModal.show(cookbook)"
                @delete-cookbook="confirmDeleteCookbook"
                @500="_500"
                @401="$emit('401')"
            />
        </b-card-group>

        <h5 v-else-if="cookbooks && cookbooks.length === 0" class="text-center">
            No cookbooks
        </h5>
    </div>
</template>

<script>
import CreateCookbookModal from "../components/CreateCookbookModal";
import CookbookCard from "../components/CookbookCard";
import AddRecipeModal from "../components/AddRecipeModal";
import CookbookView from "../components/CookbookView";

import {
    getCookbooks,
    deleteCookbook,
    addRecipe,
    removeRecipe,
} from "../services/CookbookService";

import {
    SUCCESS,
    CREATED,
    EMPTY,
    AUTH_ERROR,
    CONFLICT,
    DATA_ERROR,
} from "../util/status-codes";

export default {
    name: "Cookbooks",
    props: ["user"],
    components: {
        CreateCookbookModal,
        CookbookCard,
        AddRecipeModal,
        CookbookView,
    },
    data() {
        return {
            loading: true,
            currentCookbook: null,
            cookbooks: null,
        };
    },
    methods: {
        openCookbook(cookbook) {
            this.currentCookbook = cookbook;
        },
        confirmDeleteCookbook(cookbook) {
            this.$bvModal
                .msgBoxConfirm(
                    `Are you sure you want to delete this cookbook? This action cannot be undone.`,
                    {
                        titleHtml: `Delete <span class="text-primary">${cookbook.title}</span>`,
                        okVariant: "danger",
                        okTitle: "Delete",
                        cancelVariant: "outline-secondary",
                        cancelTitle: "Cancel",
                    }
                )
                .then((value) => {
                    if (value) this.doDeleteCookbook(cookbook);
                })
                .catch((err) => {});
        },
        doDeleteCookbook(cookbook) {
            deleteCookbook(cookbook._id)
                .then(({ status }) => {
                    switch (status) {
                        case EMPTY:
                            this.cookbooks = this.cookbooks.filter(
                                (c) => c._id !== cookbook._id
                            );
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        default:
                            this._500();
                            break;
                    }
                })
                .catch((err) => {
                    this._500(err);
                });
        },
        doAddRecipe(cid, rid) {
            addRecipe(cid, rid)
                .then(({ status, data }) => {
                    switch (status) {
                        case CREATED:
                            this.cookbooks[
                                this.cookbooks.findIndex((c) => c._id === cid)
                            ].recipes = JSON.parse(
                                JSON.stringify(data.recipes)
                            );
                            this.$refs.addRecipeModal.hide();
                            if (this.currentCookbook)
                                this.$refs.cookbookView.updateRecipes();
                            break;
                        case DATA_ERROR:
                            this.$refs.addRecipeModal.setError(
                                data.errors[0].msg
                            );
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        case CONFLICT:
                            this.$refs.addRecipeModal.setError(data.error);
                            break;
                        default:
                            this._500();
                            break;
                    }
                })
                .catch((err) => {
                    this._500(err);
                });
        },
        doRemoveRecipe(rid) {
            removeRecipe(this.currentCookbook._id, rid)
                .then(({ status, data }) => {
                    switch (status) {
                        case EMPTY:
                            this.currentCookbook.recipes = this.currentCookbook.recipes.filter(
                                (r) => r.recipe._id !== rid
                            );
                            this.$refs.cookbookView.updateRecipes();
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        default:
                            this._500();
                            break;
                    }
                })
                .catch((err) => {
                    this._500(err);
                });
        },
        _500(err) {
            this.$emit("500", err);
        },
    },
    mounted() {
        getCookbooks()
            .then(({ status, data }) => {
                switch (status) {
                    case SUCCESS:
                        this.cookbooks = data;
                        this.loading = false;
                        console.log(data);
                        break;
                    case AUTH_ERROR:
                        this.$router.push("/");
                        this.$emit("401");
                        break;
                    default:
                        this._500();
                        break;
                }
            })
            .catch((err) => {
                this._500(err);
            });
    },
};
</script>