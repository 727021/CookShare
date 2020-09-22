<template>
    <div>
        <h1 v-if="!currentRecipe" class="border-bottom">
            {{ cookbook.title }}
            <small class="text-muted"
                ><small>by</small> {{ cookbook.owner.username }}</small
            >
            <b-spinner
                v-if="loading"
                class="m-2"
                style="border-width: 4px"
            ></b-spinner>
            <b-btn
                variant="outline-danger"
                class="float-right m-1 my-2"
                v-b-tooltip.hover.left
                title="Close"
                @click="$emit('close-cookbook')"
            >
                <fa-icon icon="times" />
            </b-btn>
        </h1>
        <b-tabs
            v-if="!currentRecipe"
            active-nav-item-class="text-primary"
            content-class="mx-2 mt-2"
        >
            <b-tab title="Recipes">
                <b-table-simple striped sticky-header hover>
                    <b-thead>
                        <b-tr>
                            <b-th class="pb-2 pt-1">Title</b-th>
                            <b-th class="pb-2 pt-1">Author</b-th>
                            <b-th class="pb-2 pt-1 text-right">
                                <b-btn
                                    variant="outline-success"
                                    size="sm"
                                    class="float-right m-0"
                                    v-b-tooltip.hover.left
                                    title="Add Recipe"
                                    @click="$emit('add-recipe', cookbook)"
                                >
                                    <fa-icon icon="plus" />
                                </b-btn>
                            </b-th>
                        </b-tr>
                    </b-thead>
                    <b-tbody>
                        <b-tr v-for="recipe in recipes" :key="recipe._id">
                            <b-td>
                                <b-btn
                                    variant="link"
                                    class="p-0 m-0"
                                    @click="
                                        currentRecipe = recipes.find(
                                            (r) => r._id === recipe._id
                                        )
                                    "
                                    >{{ recipe.title }}</b-btn
                                >
                            </b-td>
                            <b-td>{{ recipe.author.username }}</b-td>
                            <b-td class="text-right">
                                <b-btn
                                    v-if="
                                        recipe.author._id === user._id ||
                                        cookbook.owner._id === user._id
                                        /* Recipe can be removed by recipe author or cookbook owner */
                                    "
                                    variant="outline-danger"
                                    size="sm"
                                    v-b-tooltip.hover.left
                                    title="Remove Recipe"
                                    @click="$emit('remove-recipe', recipe._id)"
                                >
                                    <fa-icon icon="trash-alt" />
                                </b-btn>
                            </b-td>
                        </b-tr>
                    </b-tbody>
                </b-table-simple>
            </b-tab>
            <b-tab title="Sharing" :disabled="user._id !== cookbook.owner._id"
                ><p>Sharing Settings</p>
                <b-table-simple striped sticky-header hover>
                    <b-thead>
                        <b-tr>
                            <b-th class="pb-2 pt-1">User</b-th>
                            <b-th class="pb-2 pt-1">Status</b-th>
                            <b-th class="pb-2 pt-1 text-right">
                                <!-- TODO Maybe make this an input group -->
                                <b-btn
                                    variant="outline-primary"
                                    size="sm"
                                    class="float-right m-0"
                                    v-b-tooltip.hover.left
                                    title="Share Cookbook"
                                    @click="
                                        null /* TODO open modal or send invitation */
                                    "
                                >
                                    <fa-icon icon="users" />
                                </b-btn>
                            </b-th>
                        </b-tr>
                    </b-thead>
                    <b-tbody></b-tbody>
                </b-table-simple>
            </b-tab>
        </b-tabs>

        <RecipeView
            v-if="currentRecipe"
            :recipe="currentRecipe"
            @close="currentRecipe = null"
        />
        <RecipeComments
            v-if="currentRecipe"
            :rid="currentRecipe._id"
            :cid="cookbook._id"
            :user="user"
            :owner="cookbook.owner"
            @500="_500"
            @401="$emit('401')"
        />
    </div>
</template>

<script>
import RecipeView from "../components/RecipeView";
import RecipeComments from "../components/RecipeComments";

import { getRecipes, getSharing } from "../services/CookbookService";

import {
    SUCCESS,
    NOT_MODIFIED,
    AUTH_ERROR,
    CONFLICT,
    DATA_ERROR,
} from "../util/status-codes";

export default {
    name: "CookbookView",
    components: {
        RecipeView,
        RecipeComments,
    },
    props: ["cookbook", "user"],
    data: () => ({
        recipes: [],
        sharing: [],
        loading: true,
        currentRecipe: null,
    }),
    methods: {
        updateRecipes() {
            this.loading = true;
            this.recipes = [];
            getRecipes(this.cookbook._id)
                .then(({ status, data }) => {
                    console.log(status, data);
                    switch (status) {
                        case SUCCESS:
                            this.recipes = data;
                            this.loading = false;
                            break;
                        case CONFLICT:
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        default:
                            this._500();
                            break;
                    }
                })
                .catch(this._500);
        },
        _500(err) {
            this.$emit("500", err);
        },
    },
    async mounted() {
        try {
            const { status: rStatus, data: rData } = await getRecipes(
                this.cookbook._id
            );
            switch (rStatus) {
                case SUCCESS:
                    this.recipes = rData;
                    break;
                case CONFLICT:
                    break;
                case AUTH_ERROR:
                    this.$emit("401");
                    break;
                default:
                    this._500();
                    break;
            }

            if (true /* TODO if user has access to sharing */) {
                const { status: sStatus, data: sData } = await getSharing(
                    this.cookbook._id
                );
                switch (sStatus) {
                    case SUCCESS:
                        break;
                    case DATA_ERROR:
                        break;
                    case AUTH_ERROR:
                        this.$emit("401");
                        break;
                    default:
                        this._500();
                        break;
                }
            }

            this.loading = false;
        } catch (err) {
            this._500(err);
        }

        getRecipes(this.cookbook._id)
            .then(({ status, data }) => {
                console.log(status, data);
                switch (status) {
                    case SUCCESS:
                        this.recipes = data;
                        getSharing(this.cookbook._id)
                            .then(({ status, data }) => {})
                            .catch(this._500);
                        this.loading = false;
                        break;
                    case CONFLICT:
                        break;
                    case AUTH_ERROR:
                        this.$emit("401");
                        break;
                    default:
                        this._500();
                        break;
                }
            })
            .catch(this._500);
    },
};
</script>

<style scoped>
th {
    border-top: none !important;
}
</style>