<template>
    <el-row class="chat-page-module">
        <el-col class="chat-page-left" :span="7">
            <ChatUserMain />
        </el-col>
        <el-col :span="1">
            <el-divider direction="vertical" class="all-height" />
        </el-col>
        <el-col class="chat-page-right" :span="16">
            <ChatListMain />
        </el-col>
    </el-row>
</template>

<script>
import ChatUserMain from '../Chat/ChatUserMain.vue';
import ChatListMain from '../Chat/ChatListMain.vue';

export default {
    name: 'ChatMessageMain',
    components: {
        ChatUserMain,
        ChatListMain,
    }
};
</script>

<style>
.chat-page-right .chat-box-input-divider {
    margin: 0;
}
</style>

<style scoped>
.all-height {
    height: 100%;
}
.chat-page-module {
    height: 600px;
}
</style>
  