<template>
    <div class="other-message-module">
        <div class="other-message-header">
            <el-link 
                class="other-message-type-text no-select btn" 
                type="primary" 
                :underline="false" 
                target="_blank" 
                @click="changeMessageType(null)" 
                style="margin-right: 20px;"
            >
                全部{{ totalCount }}
            </el-link>
            <el-link 
                class="other-message-type-text no-select btn" 
                :class="{red_color: notReadCount > 0, gray_color: notReadCount == 0}"
                type="primary" 
                :underline="false" 
                target="_blank" 
                @click="changeMessageType(false)" 
            >
                未读{{ notReadCount }}
            </el-link>
            <span v-if="notReadCount > 0" class="other-message-options">
                <el-link class="other-message-type-text no-select btn" type="primary" :underline="false" target="_blank" @click="updateAllHasRead">全部已读</el-link>
            </span>
        </div>
        <div v-if="otherMessageList.length > 0" class="other-message-main" v-infinite-scroll="loadMoreMessage" :infinite-scroll-disabled="scrollDisabled">
            <el-card 
                shadow="always" 
                :body-style="{ padding: '20px' }" 
                class="other-message-single" 
                v-for="(otherMessage, index) of otherMessageList" 
                :key="index"
                @click="updateMessageHasRead(otherMessage.Id, index, otherMessage.HasRead)"
            >
                <div class="other-message-top">
                    <div class="other-message-top-left">
                        <el-avatar class="other-message-avatar cursor-pointer" :size="50" :src="otherMessage.SendUserAvatarUrl"></el-avatar>
                    </div>
                    <div class="other-message-top-right">
                        <div class="other-message-username hover-orange cursor-pointer">{{ otherMessage.SendUserName }}</div>
                        <div class="other-message-time hover-orange cursor-pointer">{{ formatDate(otherMessage.CreationTime) }}</div>
                        <div class="other-message-content">{{ otherMessage.Content }}</div>
                    </div>
                    <div class="other-message-red-dot"><el-badge :is-dot="!otherMessage.HasRead"></el-badge></div>
                </div>
                <div class="other-message-bottom">
                    <div class="other-message-target-content">{{ otherMessage.TargetContent }}</div>
                </div>
            </el-card>
            <p class="load-text" v-if="loading">Loading...</p>
            <p class="load-text" v-if="noMore">没有更多内容了~</p>
        </div>
        <el-card v-if="otherMessageList.length == 0" shadow="always" :body-style="{ padding: '20px' }" class="other-message-single">暂无通知</el-card>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';

export default {
    name: "NotifyMessageMain",
    setup() {
        const store = useStore();
        let otherMessageList = computed({
            get() {
                return store.state.message.messageNotifyList[2];
            },
            set() {
            }
        });
        let notReadCount = computed(() => store.state.message.messageNotifyNotReadCount[2]);
        let totalCount = computed(() => store.state.message.messageNotifyTotalCount[2]);
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
                Type: 2,
                success(result) {
                    store.commit("setMessageNotifyNotReadCount", {
                        Index: 2,
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
                    Type: 2,
                    HasRead: type
                },
                success(result) {
                    result["Index"] = 2;
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
                Type: 2,
                success() {
                    store.commit("updateMessageNotifyReadStatusAll", {
                        Index: 2
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
                    PageIndex: store.state.message.messageNotifyPageIndex[2],
                    PageSize: 20,
                    UserId: store.state.user.userId,
                    Type: 2,
                    HasRead: messageType.value
                },
                success(result) {
                    loading.value = false;
                    if (result.Items.length == 0) {
                        noMore.value = true;
                        return;
                    }
                    result["Index"] = 2;
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
        const updateMessageHasRead = (id, index, status) => {
            if (status) return ;
            store.dispatch("updateNotificationReadStatusById", {
                Id: id,
                success() {
                    store.commit("updateMessageNotifyReadStatusSingle", {
                        Index: 2,
                        IndexOfList: index
                    })
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        return {
            otherMessageList,
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

.other-message-module {
    margin-top: -9px;
}
.other-message-header {
    margin-top: 10px;
}
.other-message-type-text {
    font-size: 17px;
}
.other-message-options {
    float: right;
}
.other-message-single {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    cursor: pointer;
}
.other-message-top {
    display: flex;
}
.other-message-top-right {
    margin-left: 15px;
}
.other-message-username {
    margin: 5px 0;
    font-weight: 600;
}
.other-message-time {
    color: #939393;
    font-size: 12px;
}
.other-message-content {
    margin-top: 7px;
}
.other-message-red-dot {
    margin-left: auto;
}
.other-message-bottom {
    padding: 0 100px 0 65px;
    margin-top: 10px;
}
.other-message-target-content {
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