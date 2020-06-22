<template>
    <router-link :to="page" v-slot="{href, route, navigate, isExactActive, isActive}">
        <li class="nav-item" :class="{'active': exact ? isExactActive : isActive}">
            <a :href="href" @click="navigate" class="nav-link">{{text || route.name}}</a>
        </li>
    </router-link>
</template>

<script>
export default {
    name: "NavLink",
    props: ["page", "exact", "text"]
};
</script>