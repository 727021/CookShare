<template>
    <router-link :to="page" v-slot="{href, route, navigate, isExactActive}">
        <li class="nav-item" :class="{'active': isExactActive}">
            <a :href="href" @click="navigate" class="nav-link">{{route.name}}</a>
        </li>
    </router-link>
</template>

<script>
export default {
    name: "NavLink",
    props: ["page"]
};
</script>