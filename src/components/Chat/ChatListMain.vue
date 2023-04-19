<template>
    <div class="chat-box">
        <div class="chat-box-top">{{ chatUserName }}</div>
        <el-divider class="chat-box-top-divider" />
        <div class="chat-box-main">
            <div 
                class="chat-message-single" 
                v-for="(chatMessage, index) of chatMessageList" :key="index"
            >
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
        </div>
    </div>
    <el-divider class="chat-box-input-divider" />
    <div class="chat-input">
        <el-input placeholder="请输入消息内容" v-model="newMessageText" type="textarea" :rows="5" resize="none" />
        <el-button class="chat-input-btn" type="primary" @click="sendMessage">发送</el-button>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default {
    name: 'ChatListMain',
    setup() {
        const store = useStore();
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
        let socket = computed({
            get() {
                return store.state.socket;
            },
            set() {

            }
        });
        socket.value.onmessage = function(data) {
            let message = JSON.parse(data.data);
            if (message.ReceiveUserId == myUserId.value && message.Type == 2) {
                if (message.SendUserId == chatUserId.value) {
                    store.commit("addChatMessageToList", {
                        SendUserId: message.SendUserId,
                        ReceiveUserId: message.ReceiveUserId,
                        HasRead: true,
                        Content: message.Content,
                        CreationTime: message.CreationTime
                    });
                } else {
                    ElMessage.success("待确定用户，未读");
                }
            }
        };
        const sendMessage = () => {
            if (newMessageText.value.trim() !== "") {
                let message = {
                    Type: 2, 
                    SendUserId: myUserId, 
                    SendUserAvatar: store.state.user.avatarUrl,
                    SendUserName: store.state.user.userName,
                    ReceiveUserId: chatUserId.value, 
                    Content: newMessageText.value,
                    CreationTime: new Date()
                };
                if (socket.value.readyState === 1) {
                    socket.value.send(JSON.stringify(message));
                    store.commit("addChatMessageList", {
                        SendUserId: message.SendUserId,
                        ReceiveUserId: message.ReceiveUserId,
                        HasRead: false,
                        Content: message.Content,
                        CreationTime: message.CreationTime
                    });
                    newMessageText.value = '';
                } else {
                    ElMessage.error("socket未连接");
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
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };
        const chatContentFormat = (content) => {
            if (content == undefined || content == "") return content;
            return content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        };
        return {
            myUserId,
            myAvatarUrl,
            chatMessageList,
            newMessageText,
            chatUserName,
            chatUserAvatarUrl,
            sendMessage,
            chatTimeFormat,
            chatContentFormat,
        }
    }
};
</script>

<style>
.chat-message-content .el-card__body {
    padding: 5px;
}
</style>

<style scoped>
.chat-box {
    height: 65%;
}
.chat-box-main {
    height:100%;
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
.chat-message-time {
    font-size: 12px;
}
.chat-input {
    height: 30%;
}
.chat-input-btn {
    margin-top: 10px;
    float: right;
}
</style>
  