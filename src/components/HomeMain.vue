<template>
    <a>这里是热门的动态</a>
    <ChatModule />
</template>

<script>
import ChatModule from './Chat/ChatModule.vue';

export default {
    name: "HomeMain",
    components: {
        ChatModule,
    }
}
</script>

<style scoped>

</style>