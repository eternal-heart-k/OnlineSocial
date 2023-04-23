<template>
    <div class="comment-message-module">
        <div class="comment-message-header">
            <el-link 
                class="comment-message-type-text no-select btn" 
                type="primary" 
                :underline="false" 
                target="_blank" 
                @click="changeMessageType(null)" 
                style="margin-right: 20px;"
            >
                全部{{ totalCount }}
            </el-link>
            <el-link 
                class="comment-message-type-text no-select btn" 
                :class="{red_color: notReadCount > 0, gray_color: notReadCount == 0}"
                type="primary" 
                :underline="false" 
                target="_blank" 
                @click="changeMessageType(false)" 
            >
                未读{{ notReadCount }}
            </el-link>
            <span v-if="notReadCount > 0" class="comment-message-options">
                <el-link class="comment-message-type-text no-select btn" type="primary" :underline="false" target="_blank" @click="updateAllHasRead">全部已读</el-link>
            </span>
        </div>
        <div v-if="commentMessageList.length > 0" class="comment-message-main" v-infinite-scroll="loadMoreMessage" :infinite-scroll-disabled="scrollDisabled">
            <el-card 
                shadow="always" 
                :body-style="{ padding: '20px' }" 
                class="comment-message-single" 
                v-for="(commentMessage, index) of commentMessageList" 
                :key="index"
                @click="updateMessageHasRead(commentMessage.SendUserId, commentMessage.Type, commentMessage.TargetId, index, commentMessage.HasRead)"
            >
                <div class="comment-message-top">
                    <div class="comment-message-top-left">
                        <el-avatar class="comment-message-avatar cursor-pointer" :size="50" :src="commentMessage.SendUserAvatarUrl"></el-avatar>
                    </div>
                    <div class="comment-message-top-right">
                        <div class="comment-message-username hover-orange cursor-pointer">{{ commentMessage.SendUserName }}</div>
                        <div class="comment-message-time hover-orange cursor-pointer">{{ formatDate(commentMessage.CreationTime) }}</div>
                        <div class="comment-message-content">{{ commentMessage.Content }}</div>
                    </div>
                    <div class="comment-message-red-dot"><el-badge :is-dot="!commentMessage.HasRead"></el-badge></div>
                </div>
                <div class="comment-message-bottom">
                    <div class="comment-message-target-content">{{ commentMessage.TargetContent }}</div>
                </div>
            </el-card>
            <p class="load-text" v-if="loading">Loading...</p>
            <p class="load-text" v-if="noMore">没有更多内容了~</p>
        </div>
        <el-card v-if="commentMessageList.length == 0" shadow="always" :body-style="{ padding: '20px' }" class="comment-message-single">暂无通知</el-card>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';

export default {
    name: "CommentMessageMain",
    setup() {
        const store = useStore();
        let commentMessageList = computed({
            get() {
                return store.state.message.messageNotifyList[0];
            },
            set() {
            }
        });
        let notReadCount = computed(() => store.state.message.messageNotifyNotReadCount[0]);
        let totalCount = computed(() => store.state.message.messageNotifyTotalCount[0]);
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };
        let messageType = ref(null);
        const changeMessageType = (type) => {
            messageType.value = type;
            store.dispatch("getNotificationNotReadCount", {
                UserId: store.state.user.userId,
                Type: 0,
                success(result) {
                    store.commit("setMessageNotifyNotReadCount", {
                        Index: 0,
                        NotReadCount: result
                    });
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
            store.dispatch("getNotificationListByType", {
                param: {
                    PageIndex: 1,
                    PageSize: 20,
                    UserId: store.state.user.userId,
                    Type: 0,
                    HasRead: type
                },
                success(result) {
                    result["Index"] = 0;
                    if (type == false) { 
                        store.commit("refreshMesageNotifyListWithNotRead", result);
                    } else {
                        store.commit("refreshMessageNotifyList", result);
                    }
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        const updateAllHasRead = () => {
            store.dispatch("updateNotificationReadStatusList", {
                UserId: store.state.user.userId,
                Type: 0,
                success() {
                    store.commit("updateMessageNotifyReadStatusAll", {
                        Index: 0
                    });
                },
                error(message) {
                    ElMessage.error(message);
                }
            })
        };
        const loadMoreMessage = () => {
            loading.value = true;
            store.dispatch("getNotificationListByType", {
                param: {
                    PageIndex: store.state.message.messageNotifyPageIndex[0],
                    PageSize: 20,
                    UserId: store.state.user.userId,
                    Type: 0,
                    HasRead: messageType.value
                },
                success(result) {
                    loading.value = false;
                    if (result.Items.length == 0) {
                        noMore.value = true;
                        return;
                    }
                    result["Index"] = 0;
                    store.commit("addMessageNotifyList", result);
                },
                error(message) {
                    loading.value = false;
                    ElMessage.error(message);
                }
            });
        };
        let loading = ref(false);
        let noMore = ref(false);
        let scrollDisabled = computed(() => loading.value || noMore.value);
        const updateType = (type) => {
            if (type == "LikePost") return 0;
            else if (type == "LikeComment") return 1;
            else if (type == "Chat") return 2;
            else if (type == "CommentPost") return 3;
            else if (type == "CommentComment") return 4;
            else if (type == "Other") return 5;
            return type;
        };
        const updateMessageHasRead = (sendUserId, type, targetId, index, status) => {
            if (status) return ;
            store.dispatch("updateMessageNotifyHasReadByInfo", {
                param: {
                    FromUserId: sendUserId,
                    ToUserId: store.state.user.userId,
                    Type: updateType(type),
                    TargetId: targetId
                },
                success() {
                    store.commit("updateMessageNotifyReadStatusSingle", {
                        Index: 0,
                        IndexOfList: index
                    })
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        return {
            commentMessageList,
            notReadCount,
            totalCount,
            loading,
            noMore,
            scrollDisabled,
            formatDate,
            changeMessageType,
            updateAllHasRead,
            loadMoreMessage,
            updateMessageHasRead,
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

.comment-message-module {
    margin-top: -9px;
}
.comment-message-header {
    margin-top: 10px;
}
.comment-message-type-text {
    font-size: 17px;
}
.comment-message-options {
    float: right;
}
.comment-message-single {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    cursor: pointer;
}
.comment-message-top {
    display: flex;
}
.comment-message-top-right {
    margin-left: 15px;
}
.comment-message-username {
    margin: 5px 0;
    font-weight: 600;
}
.comment-message-time {
    color: #939393;
    font-size: 12px;
}
.comment-message-content {
    margin-top: 7px;
}
.comment-message-red-dot {
    margin-left: auto;
}
.comment-message-bottom {
    padding: 0 100px 0 65px;
    margin-top: 10px;
}
.comment-message-target-content {
    width: 100%;
    padding: 10px;
    background-color: #F2F2F2;
}
.load-text {
    text-align: center;
    font-size: 14px;
    color: #939393;
    margin: 20px 0 30px 0;
}
</style>