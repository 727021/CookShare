<template>
    <b-card>
        <b-card-title>{{ cookbook.title }}</b-card-title>
    </b-card>
</template>

<script>
export default {
    name: "CookbookCard",
    props: ["cookbook", "cookbooks", "user"]
};
</script>