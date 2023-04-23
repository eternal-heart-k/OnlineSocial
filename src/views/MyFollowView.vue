<template>
    <HomeView 
        :isFollowedUserPost="true"
    />
</template>

<script>
import HomeView from './HomeView.vue';

export default {
    name: "MyFollowView",
    components: {
        HomeView,
    }
}
</script>

<style scoped>

</style>