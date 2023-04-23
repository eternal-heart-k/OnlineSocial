<template>
    <div class="message-module">
        <el-row>
            <el-col :span="2"></el-col>
            <el-col :span="4">
                <el-card shadow="always" :body-style="{ padding: '20px' }" class="message-type-select-module">
                    <div class="message-select-title">
                        消息
                    </div>
                    <div class="message-select-options width-all">
                        <div class="message-select-single">
                            <el-button class="message-select-btn width-all" :class="{btn_selected_color: selectType == 0}" round @click="updateSelectType(0)">
                                私信<el-badge :is-dot="chatRedDot" class="message-select-red-dot" />
                            </el-button>
                        </div>
                        <div class="message-select-single">
                            <el-button class="message-select-btn width-all" :class="{btn_selected_color: selectType == 1}" round @click="updateSelectType(1)">
                                评论<el-badge :is-dot="commentNotifyRedDot" class="message-select-red-dot" />
                            </el-button>
                        </div>
                        <div class="message-select-single">
                            <el-button class="message-select-btn width-all" :class="{btn_selected_color: selectType == 2}" round @click="updateSelectType(2)">
                                点赞<el-badge :is-dot="likeNotifyRedDot" class="message-select-red-dot" />
                            </el-button>
                        </div>
                        <div class="message-select-single">
                            <el-button class="message-select-btn width-all" :class="{btn_selected_color: selectType == 3}" round @click="updateSelectType(3)">
                                其他<el-badge :is-dot="otherNotifyRedDot" class="message-select-red-dot" />
                            </el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="15" v-if="selectType == 0">
                <el-card shadow="always" :body-style="{ padding: '20px 0 20px 20px' }">
                    <ChatMessageMain />
                </el-card>                
            </el-col>
            <el-col :span="11" v-if="selectType == 1">
                <CommentMessageMain />
            </el-col>
            <el-col :span="11" v-if="selectType == 2">
                <LikeMessageMain />
            </el-col>
            <el-col :span="11" v-show="selectType == 3 && !isAdmin">
                <NotifyMessageMain />
            </el-col>
            <el-col :span="11" v-show="selectType == 3 && isAdmin">
                <FeedbackMessageMain />
            </el-col>
            <el-col :span="3"></el-col>
        </el-row>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import ChatMessageMain from '../components/message/ChatMessageMain.vue';
import CommentMessageMain from '../components/message/CommentMessageMain.vue';
import LikeMessageMain from '../components/message/LikeMessageMain.vue';
import NotifyMessageMain from '../components/message/NotifyMessageMain.vue';
import FeedbackMessageMain from '../components/message/FeedbackMessageMain.vue';

export default {
    name: "MessageView",
    components: {
        ChatMessageMain,
        CommentMessageMain,
        LikeMessageMain,
        NotifyMessageMain,
        FeedbackMessageMain,
    },
    setup() {
        const store = useStore();
        const isAdmin = ref(store.state.user.isAdmin);
        let selectType = computed({
            get() {
                return store.state.message.selectType;
            }
        });
        const updateSelectType = (type) => {
            store.commit("updateMessageSelectType", type);
        };
        let chatRedDot = computed({
            get() {
                for (let item of store.state.message.chatUserList) {
                    if (item.NotReadCount > 0) {
                        return true;
                    }
                }
                return false;
            },
            set() {
            }
        });
        let commentNotifyRedDot = computed({
            get() {
                return store.state.message.messageNotifyNotReadCount[0] > 0;
            },
            set() {
            }
        });
        let likeNotifyRedDot = computed({
            get() {
                return store.state.message.messageNotifyNotReadCount[1] > 0;
            },
            set() {
            }
        });
        let otherNotifyRedDot = computed({
            get() {
                if (store.state.user.isAdmin) return store.state.feedback.feedbackMessageNotifyNotReadCount > 0;
                return store.state.message.messageNotifyNotReadCount[2] > 0;
            },
            set() {
            }
        });
        return {
            isAdmin,
            selectType,
            chatRedDot,
            commentNotifyRedDot,
            likeNotifyRedDot,
            otherNotifyRedDot,
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
.message-type-select-module {
    position: fixed;
    width: 15%;
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
}
</style>