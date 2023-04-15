<template>
    <div class="my-post-list" v-infinite-scroll="loadMorePost" :infinite-scroll-disabled="scrollDisabled">
        <div class="my-post-list-card" v-for="(post, postIndex) in postList" :key="postIndex">
            <el-card>
                <el-header class="flex-box post-top">
                    <div class="post-top-avatar">
                        <el-avatar :size="50" :src="post.AvatarUrl" />
                    </div>
                    <div class="post-top-main">
                        <div class="tenpx-l-r align-center post-top-username btn hover-orign">
                            {{ userName }}
                        </div>
                        <div class="tenpx-l-r align-center post-top-time hover-orign text-noselect">
                            {{ formatDate(post.CreationTime) }} 
                        </div>
                    </div>
                    <div class="post-top-readcount">
                        <div class="post-top-readcount-number">{{ formatReadCount(post.ReadCount) }}</div>
                        <div class="post-top-readcount-text">浏览量</div>
                    </div>
                    <div v-if="post.CanDelete" class="post-top-options">
                        <el-icon class="btn" :size="20" @click="deleteMyPost(postIndex, post.Id)">
                            <Delete />
                        </el-icon>
                    </div>
                </el-header>
                <el-main class="post-main">
                    <p class="post-text" v-if="!post.OverFlow || !post.IsCollapsed" v-html="formatContent(post.Content)"></p>
                    <p class="post-text" v-if="post.IsCollapsed" v-html="formatContent(collapsedText(post.Content))"></p>
                    <a class="post-text-a btn" v-if="post.OverFlow" @click.prevent="toggleCollapse(postIndex)">
                        {{ post.IsCollapsed ? " 展开" : " 收起" }}
                    </a>
                    <div v-if="post.Images" class="post-list">
                        <el-row style="width: 85%;" :gutter="5">
                            <el-col v-for="imageUrl in post.Images.split(';')" :key="imageUrl" :span="8">
                                <div style="position: relative;">
                                    <el-image 
                                        :lazy="true" 
                                        class="single-image btn" 
                                        :src="imageUrl"
                                        @click="showImagePre(imageUrl)"
                                    ></el-image>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-main>
                <el-footer class="flex-box post-footer">
                    <div class="flex-box flex-center post-comment btn hover-orange post-footer-comment" @click="commentPostShow(postIndex)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square-text" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        <div class="flex-center post-footer-comment-count">{{ post.CommentCount }}</div>
                    </div>
                    <div class="flex-box flex-center post-like btn hover-orange post-footer-like" :class="{orange:post.IsLiked}" @click="likePost(postIndex, post.IsLiked, post.Id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                        </svg>
                        <div class="flex-center post-footer-like-count">{{ post.LikeCount }}</div>
                    </div>
                </el-footer>
                <div v-if="post.CommentPostVisible" class="comment-module">
                    <div class="comment-top flex-box">
                        <el-avatar class="comment-top-avatar flex-center" :size="35" :src="avatarUrl"></el-avatar>
                        <div class="comment-top-right flex-col">
                            <div class="comment-top-right-top">
                                <el-input 
                                    class="comment-top-input" 
                                    placeholder="发表你的评论~" 
                                    v-model="post.NowCommentContent"
                                    :maxlength="100"
                                    :show-word-limit="true"
                                    type="textarea"
                                    resize="none" 
                                    :autosize="{minRows: 2}"
                                ></el-input>
                            </div>
                            <div class="comment-top-right-footer flex-box">
                                <div class="comment-top-img btn">
                                    <el-upload
                                        :http-request="(ops) => uploadCommentImage(ops, postIndex)"
                                        :disabled="post.CommentPostImage != null"
                                        :show-file-list="false"
                                        >
                                        <el-tooltip
                                            class="box-item"
                                            content="最多一张，不能再多了~"
                                            placement="bottom"
                                            effect="light"
                                            :disabled="post.CommentPostImage == null"
                                        >
                                            <el-icon :size="25"><Picture /></el-icon>
                                        </el-tooltip>
                                    </el-upload>
                                </div>
                                <el-button 
                                    class="comment-top-btn" 
                                    type="primary" 
                                    size="default" 
                                    @click="commentPost(postIndex, post.NowCommentContent, post.Id)"
                                    v-loading.fullscreen.lock="commentPostLoading"
                                    :round="true"
                                >
                                    发布
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div v-if="post.CommentPostImagePre" class="comment-post-image-pre-module">
                        <el-image 
                            :lazy="true" 
                            class="comment-post-image-pre btn" 
                            :src="post.CommentPostImagePre" 
                            @click="showImagePre(post.CommentPostImagePre)">
                        </el-image>
                        <div class="comment-post-image-pre-delete btn" @click="removeCommentImage(postIndex)">X</div>
                    </div>
                    <div class="comment-order-type">
                        <span class="btn" :class="{orange: post.CommentOrderType == 0}" @click="postCommentOrderTypeChanged(postIndex, post.Id, 0)">按热度</span>
                        <span class="btn" :class="{orange: post.CommentOrderType == 1}" @click="postCommentOrderTypeChanged(postIndex, post.Id, 1)">按时间</span>
                    </div>
                    <div class="comment-main">
                        <el-row class="comment-single flex-box" v-for="(postComment, postCommentIndex) of post.PostCommentList" :key="postCommentIndex">
                            <div class="comment-single-left">
                                <el-avatar class="comment-single-avatar" :size="35" :src="postComment.AvatarUrl"></el-avatar>
                            </div>
                            <div class="comment-single-right">
                                <div class="comment-single-right-top">
                                    <a class="comment-single-username">{{ postComment.UserName }}</a>
                                    <span class="comment-single-content">
                                        {{ "：" + postComment.Content }}
                                    </span>
                                </div>
                                <div class="comment-single-right-mid">
                                    <div v-if="postComment.Image" class="comment-single-image btn">
                                        <el-image 
                                            class="image-boder-radius"
                                            :lazy="true"
                                            :src="postComment.Image" 
                                            @click="showImagePre(postComment.Image)">
                                        </el-image>
                                    </div>
                                </div>
                                <div class="comment-single-right-footer flex-space-between align-center">
                                    <div class="comment-single-time">
                                        {{ formatDate(postComment.CreationTime) }}
                                    </div>
                                    <div class="comment-single-right-footer-right flex-box align-center">
                                        <div v-if="postComment.CanDelete" class="comment-single-delete btn hover-orange gray">
                                            <el-icon :size="16" @click="deleteComment(postComment.Id, postIndex, postCommentIndex)">
                                                <Delete />
                                            </el-icon>
                                        </div>
                                        <div class="comment-single-comment btn hover-orange gray" @click="commentComment(postComment.Id, postComment.UserName, postIndex, postCommentIndex)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square-text" viewBox="0 0 16 16">
                                                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                                            </svg>
                                        </div>
                                        <div class="comment-single-like btn hover-orange gray" :class="{orange: postComment.IsLiked}" @click="likeComment(postIndex, postCommentIndex, postComment.Id, postComment.IsLiked)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                            </svg>
                                            {{ " " + postComment.LikeCount }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="postComment.ReplyCount > 0" class="comment-single-right-reply">
                                    <a class="post-comment-reply-text" @click="subCommentShow(postComment)">共{{ postComment.ReplyCount }}条回复></a>
                                </div>
                            </div>
                        </el-row>
                        <p class="load-text" v-if="post.PostCommentLoading">Loading...</p>
                        <p class="load-text btn" v-if="!post.PostCommentLoading && !post.NoMore" @click="loadMoreComment(postIndex, post.Id)">查看更多评论></p>
                        <p class="load-text" v-if="post.NoMore">没有更多评论了~</p>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
    <p class="load-text" v-if="loading">Loading...</p>
    <p class="load-text" v-if="noMore">没有更多内容了~</p>
    <CommentReplyForm 
        :userName="commentReplyUserName"
        :commentId="commentReplyId"
        :commentRootId="commentReplyRootId"
        :postIndex="commentReplyPostIndex"
        :postCommentIndex="commentReplyPostCommentIndex"
    />
    <SubCommentInfo 
        :postComment="subCommentInfoList"
    />
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { Delete, Picture } from "@element-plus/icons";
import { ElMessage, ElMessageBox } from 'element-plus';
import CommentReplyForm from './CommentReplyForm.vue';
import SubCommentInfo from './SubCommentInfo.vue';

export default {
    name: "PostShowInfo",
    components: {
        Delete,
        Picture,
        CommentReplyForm,
        SubCommentInfo,
    },
    setup() {
        const store = useStore();
        const contentCountLimit = ref(150);
        let postList = computed({
            get() {
                let list = store.state.post.myPostList;
                for (let i = 0; i < list.length; i ++ ) {
                    list[i]["CommentPostVisible"] = false;
                    list[i]["NowCommentContent"] = "";
                    list[i]["CommentPostImage"] = null;
                    list[i]["CommentPostImagePre"] = null;
                    list[i]["CommentOrderType"] = 0;
                    list[i]["NoMore"] = false;
                    list[i]["PostCommentLoading"] = false;
                    if (list[i].Content.length > contentCountLimit.value) {
                        list[i]["OverFlow"] = true;
                        list[i]["IsCollapsed"] = true;
                    } else {
                        list[i]["OverFlow"] = false;
                        list[i]["IsCollapsed"] = false;
                    }
                }
                return list;
            },
            set() {
            }
        });
        let avatarUrl = computed({
            get() {
                return store.state.user.avatarUrl;
            },
            set() {
            }
        });
        let userName = computed({
            get() {
                return store.state.user.userName;
            },
            set() {
            }
        });
        const collapsedText = (content) => {
            return content.slice(0, contentCountLimit.value) + " ...";
        };
        const toggleCollapse = (index) => {
            postList.value[index].IsCollapsed = !postList.value[index].IsCollapsed;
        };
        const formatContent = (content) => {
            if (content == undefined || content == "") return content;
            return content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
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
        const formatReadCount = (count) => {
            if (count < 10000) {
                return count;
            }
            return (count / 10000).toFixed(1) + "万";
        };
        const likePost = (postIndex, status, postId) => {
            let param = {
                Type: 0,
                UserId: store.state.user.userId,
                TargetId: postId
            };
            let data = {
                param: param,
                success() {
                    store.commit("updateMyPostLikeStatus", {
                        PostIndex: postIndex,
                        Status: status
                    });
                },
                error(message) {
                    alert(message);
                }
            }
            if (status) {
                store.dispatch("cancelLike", data)
            } else {
                store.dispatch("like", data)
            }
        };
        const deleteMyPost = (postIndex, id) => {
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
                store.dispatch("deleteMyPost", {
                    Id: id,
                    success() {
                        store.commit("deleteMyPostFromList", postIndex);
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
        let nowImagePreview = computed({
            get() {
                return store.state.nowImagePreview;
            },
            set() {
            }
        });
        const stopScroll = () => {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        };
        const openScroll = () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
        const showImagePre = (url) => {
            store.commit("setNowImagePreview", url);
            stopScroll();
        };
        const closeImagePre = () => {
            store.commit("clearNowImagePreview");
            openScroll();
        };
        const loading = ref(false);
        const noMore = ref(false);
        let scrollDisabled = computed(() => loading.value || noMore.value);
        const loadMorePost = () => {
            loading.value = true;
            store.dispatch("getPostList", {
                param: {
                    MyUserId: store.state.user.userId,
                    UserId: store.state.user.userId,
                    PageIndex: store.state.post.myPageIndex,
                    PostOrderType: 1,
                    CommentOrderType: 0  // todo
                },
                success(result) {
                    loading.value = false;
                    if (result.Items.length == 0) {
                        noMore.value = true;
                    } else {
                        store.commit("addMyPostList", result);
                    }
                },
                error(message) {
                    loading.value = false;
                    alert(message);
                }
            });
        };
        const commentPostShow = (index) => {
            postList.value[index].CommentPostVisible = !postList.value[index].CommentPostVisible;
        };
        const commentPost = (index, content, postId) => {
            if (content == "" && postList.value[index].CommentPostImage == null) {
                alert("评论内容不能为空");
                return ;
            }
            commentPostLoading.value = true;
            if (postList.value[index].CommentPostImage != null) {
                store.dispatch("uploadSingleImage", {
                    File: postList.value[index].CommentPostImage,
                    success(result) {
                        store.dispatch("commentPost", {
                            param: {
                                Type: 0,
                                TargetId: postId,
                                UserId: store.state.user.userId,
                                Content: content,
                                Image: result
                            },
                            success() {
                                commentPostLoading.value = false;
                                removeCommentImage(index);
                                postList.value[index].NowCommentContent = "";
                                postList.value[index].CommentCount ++ ;
                                ElMessage({
                                    message: "评论成功",
                                    type: 'success',
                                });
                            },
                            error(message) {
                                ElMessage.error(message);
                            }
                        });
                    },
                    error(message) {
                        ElMessage.error(message);
                    }
                });
            } else {
                store.dispatch("commentPost", {
                    param: {
                        Type: 0,
                        TargetId: postId,
                        UserId: store.state.user.userId,
                        Content: content,
                    },
                    success() {
                        commentPostLoading.value = false;
                        removeCommentImage(index);
                        postList.value[index].NowCommentContent = "";
                        postList.value[index].CommentCount ++ ;
                        ElMessage({
                            message: "评论成功",
                            type: 'success',
                        });
                    },
                    error(message) {
                        ElMessage.error(message);
                    }
                });
            }
        };
        const uploadCommentImage = (ops, index) => {
            if (postList.value[index].CommentPostImage != null) {
                return false;
            }
            const reader = new FileReader();
            reader.readAsDataURL(ops.file);
            reader.onload = () => {
                postList.value[index].CommentPostImagePre = reader.result;
            };
            postList.value[index].CommentPostImage = ops.file;
        };
        const removeCommentImage = (index) => {
            postList.value[index].CommentPostImage = null;
            postList.value[index].CommentPostImagePre = null;
        };
        let commentReplyUserName = ref("");
        let commentReplyId = ref(0);
        let commentReplyRootId = ref(0);
        let commentReplyPostIndex = ref(-1);
        let commentReplyPostCommentIndex = ref(-1);
        const commentComment = (commentId, userName, postIndex, postCommentIndex) => {
            store.commit("updatePostCommentCommentVisible", true);
            commentReplyUserName.value = "回复@" + userName;
            commentReplyId.value = commentId;
            commentReplyRootId.value = commentId;
            commentReplyPostIndex.value = postIndex;
            commentReplyPostCommentIndex.value = postCommentIndex;
        };
        const likeComment = (postIndex, postCommentIndex, commentId, status) => {
            let param = {
                Type: 1,
                UserId: store.state.user.userId,
                TargetId: commentId
            };
            let data = {
                param: param,
                success() {
                    store.commit("updateMyPostCommentLikeStatus", {
                        PostIndex: postIndex,
                        PostCommentIndex: postCommentIndex,
                        Status: status
                    });
                },
                error(message) {
                    alert(message);
                }
            }
            if (status) {
                store.dispatch("cancelLike", data)
            } else {
                store.dispatch("like", data)
            }
        };
        const deleteComment = (commentId, postIndex, postCommentIndex) => {
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
                    Id: commentId,
                    success() {
                        store.commit("deleteMyPostComment", {
                            PostIndex: postIndex,
                            PostCommentIndex: postCommentIndex
                        });
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
        const postCommentOrderTypeChanged = (postIndex, postId, orderType) => {
            store.commit("updateMyPostCommentOrderType", {
                PostIndex: postIndex,
                OrderType: orderType
            });
            store.commit("updateMyPostCommentLoading", {
                PostIndex: postIndex,
                Status: true
            });
            store.commit("updateMyPostCommentNoMore", {
                PostIndex: postIndex,
                Status: false
            });
            store.dispatch("getPostCommentByPostId", {
                param: {
                    TargetId: postId,
                    OrderType: orderType,
                    MyUserId: store.state.user.userId,
                },
                success(result) {
                    store.commit("refreshMyPostComment", {
                        ...result,
                        PostIndex: postIndex
                    });
                    store.commit("updateMyPostCommentLoading", {
                        PostIndex: postIndex,
                        Status: false
                    });
                },
                error(message) {
                    store.commit("updateMyPostCommentLoading", {
                        PostIndex: postIndex,
                        Status: false
                    });
                    alert(message);
                }
            });
        };
        const loadMoreComment = (postIndex, postId) => {
            store.commit("updateMyPostCommentLoading", {
                PostIndex: postIndex,
                Status: true
            });
            store.dispatch("getPostCommentByPostId", {
                param: {
                    TargetId: postId,
                    OrderType: store.state.post.myPostList[postIndex].CommentOrderType,
                    MyUserId: store.state.user.userId,
                    PageIndex: store.state.post.myPostList[postIndex].PostCommentPageIndex
                },
                success(result) {
                    store.commit("updateMyPostCommentLoading", {
                        PostIndex: postIndex,
                        Status: false
                    });
                    if (result.Items.length == 0) {
                        store.commit("updateMyPostCommentNoMore", {
                            PostIndex: postIndex,
                            Status: true
                        });
                    } else {
                        store.commit("addMyPostComment", {
                            ...result,
                            PostIndex: postIndex
                        });
                    }
                },
                error(message) {
                    store.commit("updateMyPostCommentLoading", {
                        PostIndex: postIndex,
                        Status: false
                    });
                    alert(message);
                }
            });
        }
        let commentPostLoading = ref(false);
        let subCommentInfoList = ref({});
        const subCommentShow = (postComment) => {
            subCommentInfoList.value = postComment;
            store.dispatch("getSubCommentByCommentId", {
                param: {
                    TargetId: postComment.Id,
                    OrderType: 0,
                    MyUserId: store.state.user.userId
                },
                success(result) {
                    store.commit("refreshSubCommentList", result.Items);
                    store.commit("updateSubCommentVisible", true);
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        return {
            postList,
            avatarUrl,
            userName,
            contentCountLimit,
            nowImagePreview,
            loading,
            noMore,
            scrollDisabled,
            commentPostLoading,
            commentReplyUserName,
            commentReplyId,
            commentReplyRootId,
            commentReplyPostIndex,
            commentReplyPostCommentIndex,
            subCommentInfoList,
            loadMorePost,
            showImagePre,
            closeImagePre,
            toggleCollapse,
            collapsedText,
            formatContent,
            formatDate,
            formatReadCount,
            likePost,
            deleteMyPost,
            commentPostShow,
            commentPost,
            uploadCommentImage,
            removeCommentImage,
            commentComment,
            likeComment,
            deleteComment,
            postCommentOrderTypeChanged,
            loadMoreComment,
            subCommentShow,
        }
    },
}
</script>

<style>
.gray {
    color: gray;
}
.orange {
    color: #eb7350;
}
.hover-orange:hover {
    color: #eb7350;
}
.tenpx-l-r {
    margin: 0 10px 0;
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
</style>

<style scoped>
.hover-orign:hover{
    color: #eb7350;
}
.my-post-list-card {
    margin: 20px;
}
.single-image {
    width: 130px;
    height: 130px;
}
.post-list {
    margin-top: 20px;
}
.post-top {
    padding: 0;
}
.post-top-main {
    width: 75%;
}
.post-top-username {
    color: black;
}
.post-top-time {
    color: #939393;
    font-size: 12px;
    margin-top: 5px;
}
.post-top-readcount-number {
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    color: #939393;
}
.post-top-readcount-text {
    margin-top: 2px;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    color: #b7b7b7;
}
.post-main {
    margin-left: 40px;
    padding-top: 0;
}
.post-footer {
    color: gray;
    justify-content: space-evenly;
    height: 30px;
}
.post-footer-like {
    margin-left: 5px;
}
.post-top-options {
    flex: 1;
    text-align: right;
}
.post-text {
    word-wrap: break-word;
    white-space: pre-wrap;
    display: inline;
}
.post-text-a {
    text-decoration: none;
    color: #409eff;
}
.post-footer-comment-count, .post-footer-like-count {
    font-size: 14px;
    margin-left: 5px;
}
.load-text {
    text-align: center;
    font-size: 14px;
    color: #939393;
    margin-bottom: 30px;
}
.comment-module {
    margin-top: 10px;
}
.comment-top-avatar {
    margin-right: 20px;
}
.comment-top-right, .comment-top-right-top {
    width: 100%;
}
.comment-top-right-footer {
    margin-top: 15px;
    justify-content: space-between;
    width: 100%;
}
.comment-top-input {
    margin-right: 20px;
}
.comment-top-img {
    width: 20%;
    float: left;
}
.comment-post-image-pre-module {
    margin-left: 50px;
    margin-top: 10px;
    position: relative;
    width: 100px;
    height: 100px;
}
.comment-post-image-pre {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
}
.comment-post-image-pre-delete {
    position: absolute;
    top: 2px;
    right: 2px;
    color: gray;
}
.comment-post-image-pre-delete:hover {
    color:#eb7350;
}
.comment-main {
    margin-top: 10px;
}
.comment-single {
    margin: 10px 10px 10px 0;
}
.comment-single-left {
    width: 9%;
}
.comment-single-right {
    width: 91%;
}
.comment-single-username, .post-comment-reply-text {
    color: #eb7350;
    font-size: 13px;
    text-decoration: none;
    cursor: pointer;
}
.comment-single-content {
    font-size: 13px;
}
.comment-single-right-mid {
    margin-top: 10px;
}
.comment-single-image {
    width: 100px;
    height: 100px;
}
.comment-single-time {
    font-size: 12px;
    color: gray;
}
.comment-single-delete {
    margin: 2px 25px 0 0;
}
.comment-single-comment {
    margin: 3px 20px 0 0;
}
.comment-order-type {
    margin-top: 20px;
}
.comment-order-type span {
    margin-right: 30px;
}
</style>