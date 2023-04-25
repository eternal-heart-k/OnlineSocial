<template>
    <el-dialog 
        :title=userName
        v-model="dialogVisible" 
        width="40%" 
        :before-close="handleClose"
    >
        <el-form label-width="20%" @submit.prevent>
            <el-input 
                v-model="content" 
                :maxlength="100"
                :show-word-limit="true"
                type="textarea"
                resize="none" 
                :autosize="{minRows: 2}"
            ></el-input>
        </el-form>
        
        <template #footer>
            <div class="dialog-footer">
                <div class="btn">
                    <el-upload
                        :http-request="(ops) => uploadCommentImage(ops)"
                        :disabled="image != null"
                        :show-file-list="false"
                        >
                        <el-tooltip
                            class="box-item"
                            content="最多一张，不能再多了~"
                            placement="top"
                            effect="light"
                            :disabled="image == null"
                        >
                            <el-icon :size="25"><Picture /></el-icon>
                        </el-tooltip>
                    </el-upload>
                </div>
                <el-button 
                    type="primary" 
                    @click="submitForm" 
                    v-loading.fullscreen.lock="loading"
                    :round="true"
                >回复</el-button>
            </div>
            <div v-if="imagePre" class="image-pre-module">
                <el-image 
                    :lazy="true" 
                    class="image-pre btn" 
                    :src="imagePre" 
                    @click="showImagePre">
                </el-image>
                <div class="image-pre-delete btn hover-orange" @click="removeCommentImage">X</div>
            </div>
        </template>
    </el-dialog>
</template>
  
<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { Picture } from "@element-plus/icons";

export default {
    name: "CommentReplyForm",
    components: {
        Picture,
    },
    props: {
        userName: {
            type: String,
            default: "",
        },
        userId: {
            type: String,
            default: "",
        },
        commentId: {
            type: Number,
            default: 0,
        },
        commentRootId: {
            type: Number,
            default: 0,
        },
        postIndex: {
            type: Number,
            default: -1,
        },
        postCommentIndex: {
            type: Number,
            default: -1,
        },
        pageType: {
            type: Number,
            default: -1
        }
    },
    setup(props) {
        const store = useStore();
        let content = ref("");
        let image = ref(null);
        let imagePre = ref(null);
        let dialogVisible = computed({
            get() {
                return store.state.comment.postCommentCommentVisible;
            },
            set() {
            }
        });
        let loading = ref(false);

        const hideForm = () => {
            store.commit("updatePostCommentCommentVisible", false);
        };
        const clearValue = () => {
            content.value = "";
            image.value = null;
            imagePre.value = null;
        };
        const handleClose = () => {
            if (content.value == "" && image.value == null) {
                hideForm();
                return;
            }
            ElMessageBox.confirm('关闭之后将不保留', {
                title: "确认关闭？",
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: "warning",
                center: true,
                customStyle: {
                    width: '300px'
                }
            })
            .then(() => {
                hideForm();
                clearValue();
            })
            .catch(() => {
                // catch error
            });
        };
        const uploadCommentImage = (ops) => {
            image.value = ops.file;
            const reader = new FileReader();
            reader.readAsDataURL(ops.file);
            reader.onload = () => {
                imagePre.value = reader.result;
            };
        };
        const getGuid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        };
        const sendMessageWithCommentPostComment = (content) => {
            if (props.userId == "" || store.state.user.userId == props.userId) return ;
            let newGuid = getGuid();
            while (store.state.message.messageUIdSet.has(newGuid)) {
                newGuid = getGuid();
            }
            store.commit("addMessageUIdSet", newGuid);
            let message = {
                UId: newGuid,
                Type: 4, 
                SendUserId: store.state.user.userId, 
                SendUserAvatarUrl: store.state.user.avatarUrl,
                SendUserName: store.state.user.userName,
                ReceiveUserId: props.userId, 
                Content: "评论了你的评论：" + content,
                TargetId: props.commentId
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
        };
        const commentComment = (result) => {
            let tmpContent = content.value;
            store.dispatch("commentComment", {
                param: {
                    Type: 1,
                    TargetId: props.commentId,
                    CommentRootId: props.commentId,
                    UserId: store.state.user.userId,
                    Content: content.value,
                    Image: result
                },
                success() {
                    loading.value = false;
                    hideForm();
                    clearValue();
                    if (props.pageType == 0) {
                        store.commit("updateHotPostCommentReplyCount", {
                            PostIndex: props.postIndex,
                            PostCommentIndex: props.postCommentIndex
                        });
                    } else {
                        store.commit("updateMyPostCommentReplyCount", {
                            PostIndex: props.postIndex,
                            PostCommentIndex: props.postCommentIndex
                        });
                    }
                    ElMessage({
                        message: "回复成功",
                        type: 'success',
                    });
                    sendMessageWithCommentPostComment(tmpContent);
                },
                error(message) {
                    loading.value  = false;
                    ElMessage.error(message);
                }
            });
        };
        const submitForm = () => {
            if (content.value == "" && image.value == null) {
                ElMessage({
                    showClose: true,
                    message: '回复内容不能为空',
                    type: 'warning',
                });
                return;
            }
            loading.value  = true;
            if (image.value != null) {
                store.dispatch("uploadSingleImage", {
                    File: image.value,
                    success(result) {
                        commentComment(result);
                    },
                    error(message) {
                        loading.value  = false;
                        ElMessage.error(message);
                    }
                });
            } else {
                commentComment(null);
            }
        };
        const showImagePre = () => {
            store.commit("setNowImagePreview", imagePre.value);
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        };
        const removeCommentImage = () => {
            image.value = null;
            imagePre.value = null;
        };
        return {
            content,
            image,
            imagePre,
            dialogVisible,
            loading,
            hideForm,
            clearValue,
            handleClose,
            uploadCommentImage,
            submitForm,
            showImagePre,
            removeCommentImage,
        }
    },
};
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: space-between;
}
.image-pre-module {
    width: 100px;
    height: 100px;
    position: relative;
}
.image-pre {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
}
.image-pre-delete {
    position: absolute;
    top: 2px;
    right: 2px;
    color: gray;
}
</style>