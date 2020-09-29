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
                    <b-tfoot v-if="!loading && recipes.length === 0">
                        <b-tr>
                            <b-td colspan="3" class="text-center"
                                >No Recipes</b-td
                            >
                        </b-tr>
                    </b-tfoot>
                </b-table-simple>
            </b-tab>
            <b-tab title="Sharing" :disabled="user._id !== cookbook.owner._id">
                <b-table-simple striped sticky-header hover>
                    <b-thead>
                        <b-tr>
                            <b-th class="pb-2 pt-1">User</b-th>
                            <b-th class="pb-2 pt-1">Status</b-th>
                            <b-th class="pb-2 pt-1">
                                <vue-bootstrap-typeahead
                                    class="w-50 position-relative"
                                    style="z-index: 1000; left: 50%;"
                                    v-model="search"
                                    :data="autocomplete"
                                    :serializer="(item) => item.username"
                                    placeholder="Search Users"
                                    size="sm"
                                >
                                    <!-- TODO Figure out the positioning for this -->
                                    <template #suggestion="{ htmlText }">
                                        <span
                                            class="float-left position-relative"
                                            style="z-index: 1000;"
                                            v-html="htmlText"
                                        ></span>
                                    </template>
                                    <template #append>
                                        <b-btn
                                            variant="outline-primary"
                                            size="sm"
                                            class="float-right m-0"
                                            @click="
                                                null /* TODO open modal or send invitation */
                                            "
                                        >
                                            <fa-icon icon="users" />
                                            Share
                                        </b-btn>
                                    </template>
                                </vue-bootstrap-typeahead>
                            </b-th>
                        </b-tr>
                    </b-thead>
                    <b-tbody>
                        <b-tr v-for="shared in sharing" :key="shared.user._id">
                            <b-td class="text-primary">{{
                                shared.user.username
                            }}</b-td>
                            <b-td v-html="statusBadge(shared.status)"> </b-td>
                            <b-td>
                                <b-btn-group
                                    v-if="shared.status.requested"
                                    size="sm"
                                >
                                    <b-btn
                                        variant="outline-success"
                                        v-b-tooltip.hover.top
                                        title="Accept"
                                        @click="null /* TODO Accept request */"
                                    >
                                        <fa-icon icon="check" />
                                    </b-btn>
                                    <b-btn
                                        variant="outline-danger"
                                        v-b-tooltip.hover.top
                                        title="Reject"
                                        @click="null /* TODO Reject request */"
                                    >
                                        <fa-icon icon="times" />
                                    </b-btn>
                                </b-btn-group>
                                <b-btn-group
                                    v-if="shared.status.invited"
                                    size="sm"
                                >
                                    <b-btn
                                        variant="outline-primary"
                                        v-b-tooltip.hover.top
                                        title="Resend Invitation"
                                        @click="
                                            null /* TODO Resend invitation */
                                        "
                                    >
                                        <fa-icon icon="sync-alt" />
                                    </b-btn>
                                    <b-btn
                                        variant="outline-danger"
                                        v-b-tooltip.hover.top
                                        title="Cancel Invitation"
                                        @click="
                                            null /* TODO Cancel invitation */
                                        "
                                    >
                                        <fa-icon icon="trash-alt" />
                                    </b-btn>
                                </b-btn-group>
                                <b-btn-group
                                    v-if="shared.status.rejected"
                                    size="sm"
                                >
                                    <b-btn
                                        variant="outline-success"
                                        v-b-tooltip.hover.top
                                        title="Accept"
                                        @click="null /* TODO Accept request */"
                                    >
                                        <fa-icon icon="check" />
                                    </b-btn>
                                    <b-btn
                                        variant="outline-danger"
                                        v-b-tooltip.hover.top
                                        title="Delete"
                                        @click="null /* TODO Delete request */"
                                    >
                                        <fa-icon icon="trash-alt" />
                                    </b-btn>
                                </b-btn-group>
                                <b-btn-group
                                    v-if="shared.status.accepted"
                                    size="sm"
                                >
                                    <b-btn
                                        variant="outline-danger"
                                        v-b-tooltip.hover.top
                                        title="Delete"
                                        @click="null /* TODO Delete sharing */"
                                    >
                                        <fa-icon icon="trash-alt" />
                                    </b-btn>
                                </b-btn-group>
                            </b-td>
                        </b-tr>
                    </b-tbody>
                    <b-tfoot v-if="!loading && sharing.length === 0">
                        <b-tr>
                            <b-td colspan="3" class="text-center"
                                >Not Shared</b-td
                            >
                        </b-tr>
                    </b-tfoot>
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
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import _ from "underscore";

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
        VueBootstrapTypeahead,
    },
    props: ["cookbook", "user"],
    data: () => ({
        recipes: [],
        sharing: [],
        loading: true,
        currentRecipe: null,
        tmpStatus: {
            invited: false,
            requested: false,
            accepted: false,
            rejected: false,
        },
        search: "",
        autocomplete: [],
        selectedUser: null,
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
        parseStatus(status) {
            for (const prop in status)
                if (status[prop]) return prop.toLowerCase();
            return "unknown";
        },
        statusBadge(status) {
            let statusName = this.parseStatus(status);
            statusName = statusName[0].toUpperCase() + statusName.slice(1);

            switch (statusName) {
                case "Accepted":
                    return `<span class="badge badge-success">${statusName}</span>`;
                case "Invited":
                case "Requested":
                    return `<span class="badge badge-warning text-white">${statusName}</span>`;
                default:
                    return `<span class="badge badge-danger">${statusName}</span>`;
            }
        },
        updateAutocomplete(q) {
            this.autocomplete = [
                { _id: "asdf", username: "This" },
                { _id: "asdf", username: "And" },
                { _id: "asdf", username: "That" },
            ];
        },
        _500(err) {
            this.$emit("500", err);
        },
    },
    watch: {
        search: _.debounce(function (q) {
            this.updateAutocomplete(q);
        }, 500),
    },
    async mounted() {
        try {
            const { status: rStatus, data: rData } = await getRecipes(
                this.cookbook._id
            );
            console.log("getRecipes", rStatus, rData);
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

            // If user has access to sharing settings
            if (this.user._id === this.cookbook.owner._id) {
                const { status: sStatus, data: sData } = await getSharing(
                    this.cookbook._id
                );
                console.log("getSharing", sStatus, sData);
                switch (sStatus) {
                    case SUCCESS:
                        this.sharing = sData;
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
    },
};
</script>

<style scoped>
th {
    border-top: none !important;
}
</style>