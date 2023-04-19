<template>
    <div class="message-module">
        <el-row :gutter="20">
            <el-col :span="2"></el-col>
            <el-col :span="4">
                <el-card shadow="always" :body-style="{ padding: '20px' }">
                    <div class="message-select-title">
                        消息
                    </div>
                    <div class="message-select-options width-all">
                        <div class="message-select-single">
                            <el-button class="message-select-btn width-all" :class="{btn_selected_color: selectType == 0}" round @click="updateSelectType(0)">私信</el-button>
                        </div>
                        <div class="message-select-single">
                            <el-button class="message-select-btn width-all" :class="{btn_selected_color: selectType == 1}" round @click="updateSelectType(1)">评论</el-button>
                        </div>
                        <div class="message-select-single">
                            <el-button class="message-select-btn width-all" :class="{btn_selected_color: selectType == 2}" round @click="updateSelectType(2)">点赞</el-button>
                        </div>
                        <div class="message-select-single">
                            <el-button class="message-select-btn width-all" :class="{btn_selected_color: selectType == 3}" round @click="updateSelectType(3)">通知</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="15">
                <el-card shadow="always" :body-style="{ padding: '20px' }">
                    <ChatMessageMain v-if="selectType == 0" />
                    <CommentMessageMain v-if="selectType == 1" />
                    <LikeMessageMain v-if="selectType == 2" />
                    <NotifyMessageMain v-if="selectType == 3" />
                </el-card>                
            </el-col>
            <el-col :span="3"></el-col>
        </el-row>
        
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import ChatMessageMain from '../components/message/ChatMessageMain.vue';
import CommentMessageMain from '../components/message/CommentMessageMain.vue';
import LikeMessageMain from '../components/message/LikeMessageMain.vue';
import NotifyMessageMain from '../components/message/NotifyMessageMain.vue';
import { ElMessage } from 'element-plus';

export default {
    name: "MessageView",
    components: {
        ChatMessageMain,
        CommentMessageMain,
        LikeMessageMain,
        NotifyMessageMain,
    },
    beforeCreate() {
        const store = useStore();
        store.dispatch("getChatUserList", {
            success(result) {
                console.log(result);
                store.commit("refreshChatUserList", result);
            },
            error(message) {
                ElMessage.error(message);
            }
        });
    },
    setup() {
        const store = useStore();
        let selectType = computed({
            get() {
                return store.state.message.selectType;
            }
        });
        const updateSelectType = (type) => {
            store.commit("updateMessageSelectType", type);
        };
        return {
            selectType,
            updateSelectType,
        }
    }
}
</script>

<style scoped>
.message-module {
    width: 100%;
    margin-top: 40px;
}
.btn_selected_color {
    color:#409eff;
    background-color:#ecf5ff;
    border-color: #c6e2ff;
}
.message-select-title {
    margin: 0 10px 10px;
    font-size: 20px;
    text-align: center;
}
.width-all {
    width: 100%;
}
.message-select-single {
    padding: 10px 0;
    height: 40px;
}
</style>