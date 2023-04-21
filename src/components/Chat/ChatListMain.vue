<template>
    <div class="chat-box">
        <div class="chat-box-top">{{ chatUserName }}</div>
        <el-divider class="chat-box-top-divider" />
        <el-scrollbar class="chat-box-main" ref="chatScrollRef">
            <div 
                class="chat-message-single" 
                v-for="(chatMessage, index) of chatMessageList" :key="index"
            >
                <div 
                    class="chat-message-time" 
                    v-if="index == 0 || chatTimeFormat(chatMessageList[index].CreationTime) != chatTimeFormat(chatMessageList[index - 1].CreationTime)"
                >
                    {{ chatTimeFormat(chatMessage.CreationTime) }}
                </div>
                <div v-show="chatMessage.SendUserId != myUserId" class="chat-message-left">
                    <el-avatar class="chat-message-avatar" :size="35" :src="chatUserAvatarUrl"></el-avatar>
                    <div class="chat-message-left-right">
                        <el-card class="chat-message-content">
                            <p class="chat-message-content-p" v-html="chatContentFormat(chatMessage.Content)"></p>
                        </el-card>
                    </div>
                </div>
                <div v-show="chatMessage.SendUserId == myUserId" class="chat-message-right">
                    <div class="chat-message-right-left">
                        <el-card class="chat-message-content">
                            <p class="chat-message-content-p" v-html="chatContentFormat(chatMessage.Content)"></p>
                        </el-card>
                    </div>
                    <el-avatar class="chat-message-avatar" :size="35" :src="myAvatarUrl"></el-avatar>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <el-divider class="chat-box-input-divider" />
    <div class="chat-input">
        <textarea 
            class="chat-textarea" 
            v-model="newMessageText" 
            @keydown.shift.enter.exact.prevent="addNewLine"
            @keydown.enter.exact.prevent="sendMessage"
            @focus="chatInputFocusChange(true)"
            @blur="chatInputFocusChange(false)"
        >
        </textarea>
    </div>
    <p class="chat-footer">
        按下Enter发送内容/ Shift+Enter换行
    </p>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default {
    name: 'ChatListMain',
    mounted() {
        let scrollRef = this.$refs.chatScrollRef;
        setTimeout(() => {
            scrollRef.setScrollTop(1000000000);
        }, 100);
    },
    setup() {
        const store = useStore();
        let chatScrollRef = ref(null);
        let chatMessageList = computed({
            get() {
                return store.state.message.chatMessageList;
            },
            set() {

            }
        });
        let myUserId = ref(store.state.user.userId);
        let myAvatarUrl = computed({
            get() {
                return store.state.user.avatarUrl;
            },
            set() {

            }
        });
        let chatUserId = computed({
            get() {
                return store.state.message.currentChatUserId;
            },
            set() {
            }
        });
        let chatUserName = computed({
            get() {
                return store.state.message.currentChatUserName;
            },
            set() {
            }
        });
        let chatUserAvatarUrl = computed({
            get() {
                return store.state.message.currentChatUserAvatarUrl;
            },
            set() {
            }
        });
        let newMessageText = ref('');
        const getGuid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        };
        const chatScrollToTop = () => {
            setTimeout(() => {
                chatScrollRef.value.setScrollTop(1000000000);
            }, 100);
        };
        const sendMessage = () => {
            if (newMessageText.value.trim() !== "") {
                if (store.state.socket.readyState === 1) {
                    let newGuid = getGuid();
                    while (store.state.message.messageUIdSet.has(newGuid)) {
                        newGuid = getGuid();
                    }
                    store.commit("addMessageUIdSet", newGuid);
                    let message = {
                        UId: newGuid,
                        Type: 2, 
                        SendUserId: myUserId.value, 
                        SendUserAvatarUrl: store.state.user.avatarUrl,
                        SendUserName: store.state.user.userName,
                        ReceiveUserId: chatUserId.value, 
                        Content: newMessageText.value
                    };
                    store.state.socket.send(JSON.stringify(message));
                    store.commit("addChatMessageList", {
                        SendUserId: message.SendUserId,
                        ReceiveUserId: message.ReceiveUserId,
                        HasRead: false,
                        Content: message.Content,
                        CreationTime: new Date()
                    });
                    newMessageText.value = '';
                    chatScrollToTop();
                    store.dispatch("updateUserChatReadStatus", {
                        param: {
                            SendUserId: message.ReceiveUserId,
                            ReceiveUserId: message.SendUserId,
                        },
                        success() {
                            store.commit("clearChatUserNotReadCount", chatUserId.value);
                        },
                        error(message) {
                            ElMessage.error(message);
                        }
                    });
                    store.commit("sendMessageUpdateChatUserContent", {
                        UserId: message.ReceiveUserId,
                        CreationTime: new Date(),
                        Content: message.Content,
                    });
                } else {
                    ElMessage.error("网络异常或请求频繁，请刷新或稍后重试");
                    store.dispatch("setWebSocket");
                }
            }
        };
        const chatTimeFormat = (chatTime) => {
            const date = new Date(chatTime);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            let nowDate = new Date();
            if (nowDate.getFullYear() != year) {
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            } else if (nowDate.getMonth() + 1 == month && nowDate.getDate() == day) {
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        };
        const chatContentFormat = (content) => {
            if (content == undefined || content == "") return content;
            return content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        };
        const addNewLine = (e) => {
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;
            e.target.value = value.substring(0, start) + "\n" + value.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 1;
        };
        watch(chatMessageList, () => {
            chatScrollToTop();
        });
        let chatInputFocus = ref(false);
        const chatInputFocusChange = (status) => {
            if (status && !chatInputFocus.value) {
                store.dispatch("updateUserChatReadStatus", {
                    param: {
                        SendUserId: chatUserId.value,
                        ReceiveUserId: myUserId.value,
                    },
                    success() {
                        store.commit("clearChatUserNotReadCount", chatUserId.value);
                    },
                    error(message) {
                        ElMessage.error(message);
                    }
                });
            }
            chatInputFocus.value = status;
        };
        let hasNotReadMessage = computed({
            get() {
                let index = store.state.message.chatUserList.findIndex(x => x.UserId == chatUserId.value);
                if (index == -1) return false;
                return store.state.message.chatUserList[index].NotReadCount > 0;
            },
            set() {
            }
        });
        return {
            chatScrollRef,
            myUserId,
            myAvatarUrl,
            chatMessageList,
            newMessageText,
            chatUserName,
            chatUserAvatarUrl,
            chatInputFocus,
            hasNotReadMessage,
            sendMessage,
            chatTimeFormat,
            chatContentFormat,
            addNewLine,
            chatScrollToTop,
            chatInputFocusChange,
        }
    }
};
</script>

<style>
.chat-message-content .el-card__body {
    padding: 5px;
}
.chat-input .el-scrollbar__view {
    height: 100%;
}
</style>

<style scoped>
.chat-box {
    height: 78%;
}
.chat-box-main {
    overflow: auto;
    height: 390px;
}
.chat-message-single {
    margin: 5px 0;
}
.chat-message-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.chat-message-left-right {
    display: flex;
    flex-direction: column;
}
.chat-message-left .chat-message-avatar {
    margin-right: 10px;
}
.chat-message-left-right .chat-message-content {
    background-color: white;
}
.chat-message-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 20px;
}
.chat-message-right-left {
    display: flex;
    flex-direction: column;
}
.chat-message-right .chat-message-avatar {
    margin-left: 10px;
}
.chat-message-right-left .chat-message-content {
    background-color: #98E165;
}
.chat-message-right-left .chat-message-time {
    text-align: end;
}
.chat-message-content {
    max-width: 220px;
    word-break: break-word;
}
.chat-input {
    height: 21%;
}
.chat-textarea {
    width: 100%;
    height: 100%;
    overflow: auto;
    resize: none;
    border: none;
    outline: none;
    font-size: 15px;
    line-height: 22px;
    padding: 10px 10px 0 0;
    margin: 0;
    background-color: transparent;
}
.chat-input-btn {
    margin-top: 10px;
    float: right;
}
.chat-footer {
    font-size: 12px;
    margin-right: 18px;
    text-align: right;
    color: #a3a7ae;
}
.chat-message-time {
    font-size: 12px;
    text-align: center;
}
</style>
  