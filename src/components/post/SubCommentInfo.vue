<template>
    <el-dialog 
        class="subcomment-module"
        :title="title"
        v-model="visible" 
        width="40%" 
        :before-close="handleClose"
        :lock-scroll="true"
    >
        <el-scrollbar class="subcomment-content-module">
            <div class="subcomment-content">
                <div class="subcomment-content-rootcomment flex-box">
                    <div class="rootcomment-left">
                        <el-avatar class="rootcomment-avatar" :size="35" :src="rootCommentInfo.AvatarUrl"></el-avatar>
                    </div>
                    <div class="rootcomment-right">
                        <div class="rootcomment-right-top">
                            <a class="rootcomment-username username orange">{{ rootCommentInfo.UserName }}</a>
                            <span class="rootcomment-content">
                                {{ "：" + rootCommentInfo.Content }}
                            </span>
                        </div>
                        <div class="rootcomment-right-mid">
                            <div v-if="rootCommentInfo.Image" class="rootcomment-image btn">
                                <el-image 
                                    class="image-boder-radius"
                                    :lazy="true"
                                    :src="rootCommentInfo.Image" 
                                    @click="showImagePre(rootCommentInfo.Image)">
                                </el-image>
                            </div>
                        </div>
                        <div class="rootcomment-right-footer flex-space-between align-center">
                            <div class="rootcomment-time gray">
                                {{ formatDate(rootCommentInfo.CreationTime) }}
                            </div>
                            <div class="rootcomment-right-footer-right flex-box align-center">
                                <div v-if="rootCommentInfo.CanDelete" class="rootcomment-delete btn hover-orange gray">
                                    <el-icon :size="16" @click="deleteRootComment">
                                        <Delete />
                                    </el-icon>
                                </div>
                                <div class="rootcomment-comment btn hover-orange gray" @click="commentRootComment">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square-text" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                                    </svg>
                                </div>
                                <div class="rootcomment-like btn hover-orange gray" :class="{orange: rootCommentInfo.IsLiked}" @click="likeRootComment(rootCommentInfo.IsLiked)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                        <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                    </svg>
                                    {{ " " + rootCommentInfo.LikeCount }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="subcomment-list-content">
                    <div class="subcomment-list-order-type">
                        <span class="btn" :class="{orange: orderType == 0}" @click="subCommentListOrderTypeChanged(0)">按热度</span>
                        <span class="btn" :class="{orange: orderType == 1}" @click="subCommentListOrderTypeChanged(1)">按时间</span>
                    </div>
                    <div class="subcomment-list-content-show" v-infinite-scroll="loadMoreSubComment" :infinite-scroll-disabled="scrollDisabled">
                        <el-row 
                            class="subcomment-single flex-col" 
                            v-for="(subcomment, index) of subCommentList" 
                            :key="index" 
                            @mouseover="mouseOver(index)" 
                            @mouseout="mouseOut(index)"
                        >
                            <div class="subcomment-single-text word-size-small">
                                <a class="username orange">{{ subcomment.UserName }}</a>
                                <a>回复</a>
                                <a class="username orange">@{{ subcomment.ReplyUserName }}</a>
                                <span>
                                    ：{{ subcomment.Content }}
                                    <a v-if="subcomment.Image" class="subcomment-single-image-pre btn orange" @click="showImagePre(subcomment.Image)">
                                        <el-icon :size="16" style="vertical-align: -2px;">
                                            <Picture />
                                        </el-icon>
                                        <a>查看图片</a>
                                    </a>
                                </span>
                            </div>
                            <div class="subcomment-single-footer flex-space-between align-center">
                                <div class="subcomment-single-time gray time-size-small">
                                    {{ formatDate(subcomment.CreationTime) }}
                                </div>
                                <div v-show="subcomment.IsHover" class="subcomment-single-footer-right flex-box align-center">
                                    <div v-if="subcomment.CanDelete" class="subcomment-single-delete btn hover-orange gray">
                                        <el-icon :size="16" @click="deleteSubComment(subcomment.Id, index)">
                                            <Delete />
                                        </el-icon>
                                    </div>
                                    <div class="subcomment-single-comment btn hover-orange gray" @click="commentSubComment(subcomment.UserName, subcomment.Id, subcomment.UserId)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square-text" viewBox="0 0 16 16">
                                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                                        </svg>
                                    </div>
                                    <div class="subcomment-single-like btn hover-orange gray" :class="{orange: subcomment.IsLiked}" @click="likeSubComment(subcomment.Id, index, subcomment.IsLiked, subcomment.UserId)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                        </svg>
                                        {{ " " + subcomment.LikeCount }}
                                    </div>
                                </div>
                            </div>
                        </el-row>
                    </div>
                    <p class="load-text" v-if="loading">Loading...</p>
                    <p class="load-text" v-if="noMore">没有更多内容了~</p>
                </div>
            </div>
        </el-scrollbar>
    </el-dialog>
    <SubCommentReplyForm
        :userName="subCommentReplyUserName"
        :userId="subCommentReplyUserId"
        :commentId="subCommentReplyId"
        :commentRootId="subCommentReplyRootId"
        :pageType="pageType"
    />
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { Delete } from "@element-plus/icons";
import { ElMessage, ElMessageBox } from 'element-plus';
import SubCommentReplyForm from './SubCommentReplyForm.vue';

export default {
    name: "SubCommentInfo",
    components: {
        Delete,
        SubCommentReplyForm,
    },
    props: {
        postComment: {
            type: Object,
            default: () => ({}),
        },
        pageType: {
            type: Number,
            default: -1,
        }
    },
    setup(props) {
        const store = useStore();
        let subCommentReplyUserName = ref("");
        let subCommentReplyUserId = ref("");
        let subCommentReplyId = ref(0);
        let subCommentReplyRootId = ref(0);
        let title = computed({
            get() {
                return "共" + props.postComment.ReplyCount + "条回复";
            },
            set() {
            }
        });
        let visible = computed({
            get() {
                return store.state.comment.subCommentVisible;
            },
            set() {
            }
        });
        let orderType = computed({
            get() {
                return store.state.comment.orderType;
            },
            set() {
            }
        });
        let subCommentList = computed({
            get() {
                let list = store.state.comment.subCommentList;
                for (let i = 0; i < list.length; i ++ ) {
                    list[i]["IsHover"] = false;
                }
                return list;
            },
            set() {
            }
        });
        const loading = ref(false);
        const noMore = ref(false);
        let scrollDisabled = computed(() => loading.value || noMore.value);
        const hideForm = () => {
            store.commit("updateSubCommentVisible", false);
        };
        const rootCommentInfo = computed({
            get() {
                return props.postComment;
            },
            set() {
            }
        });
        const handleClose = () => {
            hideForm();
        };
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };
        const getGuid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        };
        const showImagePre = (url) => {
            store.commit("setNowImagePreview", url);
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        };
        const deleteRootComment = () => {
            ElMessageBox.confirm('确认删除么？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
                customStyle: {
                    width: '300px'
                }
            }).then(() => {
                // 点击确定按钮后执行的操作
                let commentId = rootCommentInfo.value.Id;
                store.dispatch("deleteComment", {
                    Id: rootCommentInfo.value.Id,
                    success() {
                        store.commit("deleteRootComment");
                        if (props.pageType == 0) {
                            store.commit("deleteHotPostCommentByCommentId", commentId);
                        } else {
                            store.commit("deleteMyPostCommentByCommentId", commentId);
                        }
                        ElMessage({
                            message: "删除成功",
                            type: 'success',
                        });
                    },
                    error(message) {
                        ElMessage.error(message);
                    }
                });
            }).catch(() => {
                // 点击取消按钮后执行的操作
            });
        };
        const sendLikeNotification = (userId, targetId) => {
            let newGuid = getGuid();
            while (store.state.message.messageUIdSet.has(newGuid)) {
                newGuid = getGuid();
            }
            store.commit("addMessageUIdSet", newGuid);
            let message = {
                UId: newGuid,
                Type: 1, 
                SendUserId: store.state.user.userId, 
                SendUserAvatarUrl: store.state.user.avatarUrl,
                SendUserName: store.state.user.userName,
                ReceiveUserId: userId, 
                Content: "点赞了你的评论",
                TargetId: targetId
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
        }
        const commentRootComment = () => {
            store.commit("updateSubCommentCommentVisible", true);
            subCommentReplyUserName.value = "回复@" + rootCommentInfo.value.UserName;
            subCommentReplyUserId.value = rootCommentInfo.value.UserId;
            subCommentReplyId.value = rootCommentInfo.value.Id;
            subCommentReplyRootId.value = rootCommentInfo.value.Id;
        };
        const likeRootComment = (isLiked) => {
            let data = {
                param: {
                    Type: 1,
                    UserId: store.state.user.userId,
                    TargetId: rootCommentInfo.value.Id
                },
                success() {
                    rootCommentInfo.value.IsLiked = !isLiked;
                    if (isLiked) {
                        rootCommentInfo.value.LikeCount -- ;
                    } else {
                        rootCommentInfo.value.LikeCount ++ ;
                    }
                    if (isLiked || store.state.user.userId == rootCommentInfo.value.UserId) return ;
                    sendLikeNotification(rootCommentInfo.value.UserId, rootCommentInfo.value.Id);
                },
                error(message) {
                    ElMessage.error(message);
                }
            };
            if (isLiked) {
                store.dispatch("cancelLike", data);
            } else {
                store.dispatch("like", data);
            }
        };
        const subCommentListOrderTypeChanged = (type) => {
            store.commit("updateSubCommentOrderType", type);
            loading.value = true;
            noMore.value = false;
            store.dispatch("getSubCommentByCommentId", {
                param: {
                    TargetId: rootCommentInfo.value.Id,
                    OrderType: type,
                    MyUserId: store.state.user.userId
                },
                success(result) {
                    loading.value = false;
                    if (result.Items.Length == 0) {
                        noMore.value = true;
                    } else {
                        store.commit("refreshSubCommentList", result.Items);
                    }
                },
                error(message) {
                    loading.value = false;
                    ElMessage.error(message);
                }
            });
        };
        const loadMoreSubComment = () => {
            loading.value = true;
            store.dispatch("getSubCommentByCommentId", {
                param: {
                    PageIndex: store.state.comment.subCommentIndex,
                    TargetId: rootCommentInfo.value.Id,
                    OrderType: store.state.comment.orderType,
                    MyUserId: store.state.user.userId
                },
                success(result) {
                    loading.value = false;
                    if (result.Items.length == 0) {
                        noMore.value = true;
                    } else {
                        store.commit("AddSubCommentList", result.Items);
                    }
                },
                error(message) {
                    loading.value = false;
                    ElMessage.error(message);
                }
            });
        };
        const deleteSubComment = (subCommentId, index) => {
            ElMessageBox.confirm('确认删除么？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
                customStyle: {
                    width: '300px'
                }
            }).then(() => {
                // 点击确定按钮后执行的操作
                store.dispatch("deleteComment", {
                    Id: subCommentId,
                    success() {
                        rootCommentInfo.value.ReplyCount -- ;
                        store.commit("deleteSubComment", index);
                        ElMessage({
                            message: "删除成功",
                            type: 'success',
                        });
                    },
                    error(message) {
                        ElMessage.error(message);
                    }
                });
            }).catch(() => {
                // 点击取消按钮后执行的操作
            });
        };
        const commentSubComment = (userName, subCommentId, subCommentUserId) => {
            store.commit("updateSubCommentCommentVisible", true);
            subCommentReplyUserName.value = "回复@" + userName;
            subCommentReplyUserId.value = subCommentUserId;
            subCommentReplyId.value = subCommentId;
            subCommentReplyRootId.value = rootCommentInfo.value.Id;
        };
        const likeSubComment = (subCommentId, index, isLiked, userId) => {
            let data = {
                param: {
                    Type: 1,
                    UserId: store.state.user.userId,
                    TargetId: subCommentId
                },
                success() {
                    store.commit("updateSubCommentLikeStatus", {
                        Index: index,
                        Status: isLiked
                    });
                    if (isLiked || store.state.user.userId == userId) return ;
                    sendLikeNotification(userId, subCommentId);
                },
                error(message) {
                    ElMessage.error(message);
                }
            };
            if (isLiked) {
                store.dispatch("cancelLike", data);
            } else {
                store.dispatch("like", data);
            }
        };
        const mouseOver = (index) => {
            store.commit("updateSubCommentHoverStatus", {
                Index: index,
                Status: true
            });
        };
        const mouseOut = (index) => {
            store.commit("updateSubCommentHoverStatus", {
                Index: index,
                Status: false
            });
        };
        
        return {
            title,
            visible,
            rootCommentInfo,
            orderType,
            subCommentList,
            loading,
            noMore,
            scrollDisabled,
            subCommentReplyUserName,
            subCommentReplyUserId,
            subCommentReplyId,
            subCommentReplyRootId,
            hideForm,
            handleClose,
            formatDate,
            showImagePre,
            deleteRootComment,
            commentRootComment,
            likeRootComment,
            subCommentListOrderTypeChanged,
            loadMoreSubComment,
            deleteSubComment,
            commentSubComment,
            likeSubComment,
            mouseOver,
            mouseOut,
        }
    }
}
</script>


<style>
.subcomment-module .el-dialog__title {
    font-weight: 600;
}
.subcomment-module .el-dialog__body {
    padding: 0;
}
</style>

<style scoped>
.subcomment-content-module {
    height: 500px; 
    overflow: auto;
}
.subcomment-content {
    padding: 10px 20px;
}
.rootcomment-image {
    width: 100px;
    height: 100px;
}
.rootcomment-left {
    width: 9%;
}
.rootcomment-right {
    width: 91%;
}
.rootcomment-right-mid {
    margin-top: 10px;
}
.rootcomment-content {
    font-size: 13px;
}
.rootcomment-time {
    font-size: 12px;
}
.rootcomment-delete {
    margin: 2px 25px 0 0;
}
.rootcomment-comment {
    margin: 3px 20px 0 0;
}
.subcomment-list-content {
    margin: 10px 0 0 50px;
}
.subcomment-list-order-type {
    margin-top: 10px
}
.subcomment-list-order-type span {
    margin-right: 30px;
    font-size: 12px;
}
.load-text {
    text-align: center;
    font-size: 14px;
    color: #939393;
    margin: 20px 0 30px 0;
}
.subcomment-list-content-show {
    margin: 20px 0 0 10px;
}
.subcomment-single {
    margin-bottom: 10px;
}
.subcomment-single-text {
    width: 100%;
}
.subcomment-single-footer {
    width: 100%;
    margin-top: 5px;
    height: 20px;
}
.subcomment-single-comment {
    margin: 3px 20px 0 0;
}
.subcomment-single-delete {
    margin: 2px 25px 0 0;
}

.username {
    font-size: 13px;
    text-decoration: none;
    cursor: pointer;
}
.gray {
    color: gray;
}
.orange {
    color: #eb7350;
}
.hover-orange:hover {
    color: #eb7350;
}
.flex-box {
    display: flex;
}
.flex-space-between {
    display: flex;
    justify-content: space-between;
}
.flex-center {
    align-items: center;
    justify-content: center;
    text-align: center;
}
.align-center {
    align-items: center;
}
.justify-center {
    justify-content: center;
}
.text-noselect {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.flex-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.flex-right {
    flex: 1;
    text-align: right;
}
.image-boder-radius {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
}
.word-size-small {
    font-size: 13px;
}
.time-size-small {
    font-size: 12px;
}
</style>