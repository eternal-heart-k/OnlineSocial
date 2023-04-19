<template>
    <div class="chat-user-list-module">
        <el-row class="chat-user-list-module-top">
            <el-col :span="6">
                <div class="chat-user-list-my-avatar">
                    <el-avatar :size="50" :src="avatarUrl" />
                </div>
            </el-col>
            <el-col :span="18">
                <div class="chat-user-list-my-username">
                    {{ userName }}
                </div>
            </el-col>
        </el-row>
        <el-divider />
        <el-row class="chat-user-list-search-module">
            <div class="chat-user-list-search-user">
                <el-input
                    v-model="chatUserListSearchValue"
                    class="w-50 m-2"
                    placeholder="查找联系人"
                    :prefix-icon="Search"
                />
            </div>
        </el-row>
        <el-scrollbar class="chat-user-list-module-main">
            <el-row 
                class="chat-user-single" 
                :class="{chat_user_selected_bgcolor: chatUser.UserId == currentSelectChatUserId}" 
                v-for="(chatUser, index) of showChatUserList" 
                :key="index"
                @click="chatUserSelectClick(chatUser)"
            >
                <el-col :span="6">
                    <div class="chat-user-avatar">
                        <el-avatar :size="50" :src="chatUser.AvatarUrl" />
                    </div>
                </el-col>
                <el-col :span="18" class="chat-user-right">
                    <div class="chat-user-top">
                        <div class="chat-user-username">
                            {{ chatUser.UserName }}
                        </div>
                        <div class="chat-user-time">
                            {{ chatTimeFormat(chatUser.CreationTime) }}
                        </div>
                    </div>
                    <div class="chat-user-bottom">
                        <div class="chat-user-content">
                            {{ chatUser.Content }}
                        </div>
                        <div v-if="chatUser.NotReadCount > 0" class="chat-user-not-read-count">
                            <div class="chat-user-not-read-count-module">
                                {{ chatUser.NotReadCount > 99 ? "99+" : chatUser.NotReadCount }}
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-scrollbar>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

export default {
    name: "ChatUserMain",
    setup() {
        const store = useStore();
        let currentSelectChatUserId = ref("");
        let avatarUrl = computed({
            get() {
                return store.state.user.avatarUrl;
            },
            set(){
            }
        });
        let userName = computed({
            get() {
                return store.state.user.userName;
            },
            set() {
            }
        });
        let chatUserListSearchValue = ref("");
        let showChatUserList = computed({
            get() {
                if (chatUserListSearchValue.value == "") {
                    return store.state.message.chatUserList;
                }
                return store.state.message.chatUserList.filter(x => x.UserName.indexOf(chatUserListSearchValue.value) != -1);
            }
        })
        const chatTimeFormat = (chatTime) => {
            const date = new Date(chatTime);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            let nowDate = new Date();
            if (year != nowDate.getFullYear()) {
                return `${year}-${month.toString().padStart(2, '0')}`;
            } else if (month == nowDate.getMonth() + 1 && day == nowDate.getDate()) {
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            } 
            return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        };
        const chatUserSelectClick = (chatUser) => {
            currentSelectChatUserId.value = chatUser.UserId;
            store.dispatch("getChatMessageListByUserId", {
                param: {
                    SendUserId: chatUser.UserId,
                    ReceiveUserId: store.state.user.userId
                },
                success(result) {
                    store.commit("updateCurrentChatUserInfo", {
                        UserId: chatUser.UserId,
                        UserName: chatUser.UserName,
                        AvatarUrl: chatUser.AvatarUrl
                    });
                    store.commit("refreshChatMessageList", result);
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        return {
            avatarUrl,
            userName,
            chatUserListSearchValue,
            showChatUserList,
            currentSelectChatUserId,
            chatTimeFormat,
            chatUserSelectClick,
            Search,
        }
    }
}
</script>

<style>
.chat-user-list-module .el-divider {
    margin-top: 0px;
    margin-bottom: 10px;
}
</style>

<style scoped>
.chat-user-list-module-top {
    align-items: center;
}
.chat-user-list-my-username {
    margin-bottom: 5px;
    font-size: 18px;
}
.chat-user-list-search-module {
    margin-bottom: 15px;
}
.chat-user-list-search-user {
    width: 100%;
}
.chat-user-list-module-main {
    overflow: auto;
    height: 400px;
}
.chat-user-single {
    cursor: pointer;
    padding: 5px 10px 0;
}
.chat-user-single:hover {
    background-color: #ECF5FF;
}
.chat_user_selected_bgcolor {
    background-color: #ECF5FF;
}
.chat-user-right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.chat-user-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.chat-user-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.chat-user-username {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.chat-user-time {
    font-size: 12px;
    margin-left: 10px;
}
.chat-user-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 13px;
    color: gray;
}
.chat-user-not-read-count-module {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #f75454;
    color: #ECF5FF;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
}
</style>

