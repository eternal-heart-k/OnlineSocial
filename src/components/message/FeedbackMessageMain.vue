<template>
    <div class="feedback-message-module">
        <div class="feedback-message-header">
            <el-link 
                class="feedback-message-type-text no-select btn" 
                type="primary" 
                :underline="false" 
                target="_blank" 
                @click="changeMessageType(null)" 
                style="margin-right: 20px;"
            >
                全部{{ totalCount }}
            </el-link>
            <el-link 
                class="feedback-message-type-text no-select btn" 
                :class="{red_color: notReadCount > 0, gray_color: notReadCount == 0}"
                type="primary" 
                :underline="false" 
                target="_blank" 
                @click="changeMessageType(false)" 
            >
                未处理{{ notReadCount }}
            </el-link>
        </div>
        <div v-if="feedbackList.length > 0" class="feedback-message-main" v-infinite-scroll="loadMoreMessage" :infinite-scroll-disabled="scrollDisabled">
            <el-card 
                shadow="always" 
                :body-style="{ padding: '20px' }" 
                class="feedback-message-single" 
                v-for="(feedback, index) of feedbackList" 
                :key="index"
            >
                <div class="feedback-message-top">
                    <div class="feedback-message-top-left">
                        <el-avatar class="feedback-message-avatar cursor-pointer" :size="50" :src="feedback.AvatarUrl"></el-avatar>
                    </div>
                    <div class="feedback-message-top-right">
                        <div class="feedback-message-username hover-orange cursor-pointer">{{ feedback.UserName }}</div>
                        <div class="feedback-message-time hover-orange cursor-pointer">{{ formatDate(feedback.CreationTime) }}</div>
                        <div class="feedback-message-type">{{ exchangeFeedbackTypeToText(feedback.Type) }}</div>
                        <div class="feedback-message-content-main">
                            <div class="feedback-message-content" v-html="feedback.Content"></div>
                            <div class="feedback-message-image" v-show="feedback.Image" @click="showImagePre(subcomment.Image)">
                                <el-image :src="feedback.Image" fit="fill"></el-image>
                            </div>
                        </div>
                    </div>
                    <div class="feedback-message-red-dot"><el-badge :is-dot="!feedback.HasRead"></el-badge></div>
                </div>
                <div class="feedback-message-handle" v-if="!feedback.HasRead">
                    <el-input class="feedback-message-handle-input" type="textarea" placeholder="请输入处理回复内容" v-model="feedback.HandleContent" :maxlength="100" show-word-limit :autosize="{minRows: 2}" resize="none"></el-input>
                    <el-button class="feedback-message-handle-btn" type="primary" @click="handleFeedbackMessage(feedback.HandleContent, feedback.Id, feedback.UserId, index)">处理</el-button>
                </div>
            </el-card>
            <p class="load-text" v-if="loading">Loading...</p>
            <p class="load-text" v-if="noMore">没有更多内容了~</p>
        </div>
        <el-card v-if="feedbackList.length == 0" shadow="always" :body-style="{ padding: '20px' }" class="feedback-message-single">暂无通知</el-card>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';

export default {
    name: "FeedbackMessageMain",
    setup() {
        const store = useStore();
        let feedbackList = computed({
            get() {
                let list = store.state.feedback.feedbackMessageNotifyList;
                for (let i = 0; i < list.length; i ++ ) {
                    list[i]["HandleContent"] = "";
                }
                return list;
            },
            set() {
            }
        });
        let notReadCount = computed(() => store.state.feedback.feedbackMessageNotifyNotReadCount);
        let totalCount = computed(() => store.state.feedback.feedbackMessageNotifyTotalCount);
        let messageType = ref(null);
        let loading = ref(false);
        let noMore = ref(false);
        let scrollDisabled = computed(() => loading.value || noMore.value);
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };
        const changeMessageType = (type) => {
            messageType.value = type;
            store.dispatch("getFeedbackNotReadCount", {
                success(result) {
                    store.commit("setFeedbackNotReadCount", result);
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
            store.dispatch("getFeedbackList", {
                param: {
                    PageIndex: 1,
                    PageSize: 20,
                    IsForAdmin: true,
                    HasRead: messageType.value
                },
                success(result) {
                    result["SelectType"] = messageType.value;
                    store.commit("refreshFeedbackList", result);
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        const loadMoreMessage = () => {
            loading.value = true;
            store.dispatch("getFeedbackList", {
                param: {
                    PageIndex: store.state.feedback.feedbackMessageNotifyPageIndex,
                    PageSize: 20,
                    IsForAdmin: true,
                    HasRead: messageType.value
                },
                success(result) {
                    loading.value = false;
                    if (result.Items.length == 0) {
                        noMore.value = true;
                        return;
                    }
                    store.commit("addFeedbackList", result);
                },
                error(message) {
                    loading.value = false;
                    ElMessage.error(message);
                }
            });
        };
        const exchangeFeedbackTypeToText = (feedbackType) => {
            if (feedbackType == 1) {
                return "反馈了系统bug的相关内容";
            } else if (feedbackType == 2) {
                return "反馈了用户不良行为的相关内容"
            } else {
                return "反馈了其他内容";
            }
        };
        const showImagePre = (url) => {
            store.commit("setNowImagePreview", url);
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        };
        const getGuid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        };
        const handleFeedbackMessage = (handleContent, id, userId, index) => {
            store.dispatch("updateFeedbackHasRead", {
                Id: id,
                success() {
                    store.commit("updateFeedbackReadStatus", index);
                    if (store.state.user.userId == userId) return ;
                    let newGuid = getGuid();
                    while (store.state.message.messageUIdSet.has(newGuid)) {
                        newGuid = getGuid();
                    }
                    store.commit("addMessageUIdSet", newGuid);
                    let message = {
                        UId: newGuid,
                        Type: 5, 
                        SendUserId: store.state.user.userId, 
                        SendUserAvatarUrl: store.state.user.avatarUrl,
                        SendUserName: store.state.user.userName,
                        ReceiveUserId: userId, 
                        Content: "感谢您的反馈。管理员已处理了您的反馈：" + handleContent,
                        TargetId: id
                    };
                    if (store.state.socket.readyState === 1) {
                        store.state.socket.send(JSON.stringify(message));
                        store.state.socket.send(JSON.stringify(message));
                    } else if (store.state.socket.readyState === 0) {
                        setTimeout(() => store.state.socket.send(JSON.stringify(message)), 1000);
                    } else {
                        store.dispatch("setWebSocket", {
                            success() {
                                setTimeout(() => store.state.socket.send(JSON.stringify(message)), 1000);
                            }
                        });
                    }
                },
                error(message) {
                    ElMessage.error(message);
                }
            })
        };
        return {
            feedbackList,
            notReadCount,
            totalCount,
            messageType,
            loading,
            noMore,
            scrollDisabled,
            formatDate,
            changeMessageType,
            loadMoreMessage,
            exchangeFeedbackTypeToText,
            showImagePre,
            handleFeedbackMessage,
        }
    }
}
</script>

<style scoped>
.hover-orange:hover {
    color:#eb7350;
}
.cursor-pointer {
    cursor: pointer;
}
.blue-color {
    color: #409eff;
}
.red_color {
    color: red;
}
.gray_color {
    color: gray;
}
.btn {
    cursor: pointer;
    transition: 0.3s all;
}
.btn:active {
    transform: scale(0.9);
}
.no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.feedback-message-module {
    margin-top: -9px;
}
.feedback-message-header {
    margin-top: 10px;
}
.feedback-message-type-text {
    font-size: 17px;
}
.feedback-message-single {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
}
.feedback-message-top {
    display: flex;
}
.feedback-message-top-right {
    margin-left: 15px;
}
.feedback-message-username {
    margin: 5px 0;
    font-weight: 600;
}
.feedback-message-time {
    color: #939393;
    font-size: 12px;
}
.feedback-message-type {
    margin-top: 7px;
}
.feedback-message-content-main {
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    background-color: #F2F2F2;
}
.feedback-message-image {
    width: 100px;
    height: 100px;
}
.feedback-message-red-dot {
    margin-left: auto;
}
.feedback-message-handle-input {
    width: 60%;
    margin-left: 65px;
    margin-top: 20px;
}
.feedback-message-handle-btn {
    margin-left: 30px;
}
.load-text {
    text-align: center;
    font-size: 14px;
    color: #939393;
    margin: 20px 0 30px 0;
}
</style>