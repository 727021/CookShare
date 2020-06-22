<template>
<div class="container mt-2 text-center">
    <h1>404 - Page Not Found</h1>
    <p>Looks like the page at <code>{{this.$route.params.pathMatch}}</code> doesn't exist!</p>
</div>
</template>

<script>
export default {
    name: "404"
};
</script>