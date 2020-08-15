<template>
    <b-card>
        <b-card-title class="my-0">
            <b-btn
                class="py-0"
                variant="link"
                size="lg"
                @click="$emit('open', cookbook)"
            >
                {{ cookbook.title }}
            </b-btn>
        </b-card-title>
        <b-card-body>
            <span class="float-left"
                >Recipes: {{ cookbook.recipes.length }}</span
            >
            <span class="float-right"
                >Shared: {{ cookbook.shared.length }}</span
            >
        </b-card-body>
        <template v-slot:footer>
            <b-btn-toolbar>
                <b-btn
                    v-if="
                        cookbook.owner === user._id ||
                        cookbook.owner._id === user._id
                    "
                    size="sm"
                    variant="outline-danger"
                    v-b-tooltip.hover.right
                    title="Delete"
                    @click="$emit('delete-cookbook', cookbook)"
                >
                    <fa-icon icon="trash-alt" />
                </b-btn>
                <b-btn v-else size="sm" variant="link" disabled @click.prevent>
                    {{ cookbook.owner.username }}
                </b-btn>
                <b-btn
                    size="sm"
                    class="ml-auto"
                    variant="outline-success"
                    v-b-tooltip.hover.left
                    title="Add Recipe"
                    @click="$emit('add', cookbook)"
                >
                    <fa-icon icon="plus" />
                </b-btn>
            </b-btn-toolbar>
        </template>
    </b-card>
</template>

<script>
export default {
    name: "CookbookCard",
    props: ["cookbook", "cookbooks", "user"],
};
</script>