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
                <b-btn-group
                    v-if="
                        cookbook.owner === user._id ||
                        cookbook.owner._id === user._id
                    "
                    size="sm"
                >
                    <b-btn
                        variant="outline-danger"
                        v-b-tooltip.hover.left
                        title="Delete"
                        @click="$emit('deleteCookbook', cookbook)"
                    >
                        <fa-icon icon="trash-alt" />
                    </b-btn>
                    <b-btn
                        variant="outline-primary"
                        v-b-tooltip.hover.right
                        title="Sharing"
                        @click="$emit('sharing', cookbook)"
                    >
                        <fa-icon icon="users" />
                    </b-btn>
                </b-btn-group>
                <b-btn-group v-else size="sm">
                    <b-btn variant="link" disabled @click.prevent>
                        {{ cookbook.owner.username }}
                    </b-btn>
                </b-btn-group>
                <b-btn-group size="sm" class="ml-auto">
                    <b-btn
                        variant="outline-success"
                        v-b-tooltip.hover.left
                        title="Add Recipe"
                        @click="$emit('add', cookbook)"
                    >
                        <fa-icon icon="plus" />
                    </b-btn>
                </b-btn-group>
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