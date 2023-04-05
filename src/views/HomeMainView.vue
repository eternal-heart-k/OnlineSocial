<template>
    <a>这里是热门的动态</a>
    <ChatModule />
</template>

<script>
import ChatModule from '../components/Chat/ChatModule.vue';

export default {
    name: "HomeMainView",
    components: {
        ChatModule,
    },
}
</script>

<style scoped>

</style>