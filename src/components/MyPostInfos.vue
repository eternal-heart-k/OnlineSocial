<template>
    <div class="total-count">
        全部帖子({{ postTotalCount }})
    </div>
    <div class="my-post-list">
        <div class="my-post-list-card" v-for="(post, index) in postList" :key="index">
            <el-card>
                <el-header class="flex-box post-top">
                    <div class="post-top-avatar">
                        <el-avatar :size="50" :src="avatarUrl" />
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
                    <div class="post-top-options">
                        <el-icon class="btn" :size="20" @click="deleteMyPost(post.Id)">
                            <Delete />
                        </el-icon>
                    </div>
                </el-header>
                <el-main class="post-main">
                    <p class="post-text" v-if="!post.OverFlow || !post.IsCollapsed" v-html="formatContent(post.Content)"></p>
                    <p class="post-text" v-if="post.IsCollapsed" v-html="formatContent(collapsedText(post.Content))"></p>
                    <a class="post-text-a btn" href="#" v-if="post.OverFlow" @click.prevent="toggleCollapse(post.Id)">
                        {{ post.IsCollapsed ? " 展开" : " 收起" }}
                    </a>
                    <div v-if="post.Images" class="post-list">
                        <el-row style="width: 85%;" :gutter="5">
                            <el-col v-for="imageUrl in post.Images.split(';')" :key="imageUrl" :span="8">
                                <div style="position: relative;">
                                    <el-image 
                                    :lazy="true" 
                                    class="single-image" 
                                    :src="imageUrl"
                                    @click="showImagePre(imageUrl)"
                                    ></el-image>
                                </div>
                            </el-col>
                            <el-image-viewer 
                            :url-list="[nowImagePre]"
                            :hide-on-click-modal="true"
                            v-if="nowImagePre"
                            @close="closeImagePre"
                            style="position: fixed; z-index: 9999;"/>
                        </el-row>
                    </div>
                </el-main>
                <el-footer class="flex-box post-footer">
                    <div class="flex-box flex-center post-comment btn hover-orign post-footer-comment" @click="commentPost">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square-text" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        <div class="flex-center post-footer-comment-count">{{ post.CommentCount }}</div>
                    </div>
                    <div class="flex-box flex-center post-like btn hover-orign post-footer-like" :class="{orange:post.IsLiked}" @click="likePost(post.IsLiked, post.Id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                        </svg>
                        <div class="flex-center post-footer-like-count">{{ post.LikeCount }}</div>
                    </div>
                </el-footer>
            </el-card>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { Delete } from "@element-plus/icons";

export default {
    name: "MyPostInfos",
    components: {
        Delete,
    },
    mounted() {
        const store = useStore();
        store.dispatch("getPostList", {
            param: {
                MyUserId: store.state.user.userId,
                UserId: store.state.user.userId,
                PageIndex: store.state.post.myPageIndex,
                Type: 1
            },
            success(result) {
                store.commit("refreshMyPostList", result);
            },
            error(message) {
                alert(message);
            }
        });
    },
    setup() {
        const store = useStore();
        const contentCountLimit = ref(150);
        let postTotalCount = computed({
            get() {
                return store.state.post.myTotalCount;
            },
            set() {
            }
        });
        let postList = computed({
            get() {
                var list = store.state.post.myPostList;
                for (let i = 0; i < list.length; i ++ ) {
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
        const toggleCollapse = (id) => {
            for (let i = 0; i < postList.value.length; i ++ ) {
                if (postList.value[i].Id == id) {
                    postList.value[i].IsCollapsed = !postList.value[i].IsCollapsed;
                    break;
                }
            }
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
            const seconds = date.getSeconds();
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        const formatReadCount = (count) => {
            if (count < 10000) {
                return count;
            }
            return (count / 10000).toFixed(1) + "万";
        };
        const commentPost = () => {
            alert("评论");
        };
        const likePost = (status, postId) => {
            let param = {
                Type: 0,
                UserId: store.state.user.userId,
                TargetId: postId
            };
            let data = {
                param: param,
                success() {
                    store.commit("updateMyPostLikeStatus", postId);
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
        const deleteMyPost = (id) => {
            store.dispatch("deleteMyPost", {
                Id: id,
                success() {
                },
                error(message) {
                    alert(message);
                }
            })
        };
        let nowImagePre = ref(null);
        const stopScroll = () => {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        };
        const openScroll = () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
        const showImagePre = (url) => {
            nowImagePre.value = url;
            stopScroll();
        };
        const closeImagePre = () => {
            nowImagePre.value = null;
            openScroll();
        };

        return {
            postTotalCount,
            postList,
            avatarUrl,
            userName,
            contentCountLimit,
            nowImagePre,
            showImagePre,
            closeImagePre,
            toggleCollapse,
            collapsedText,
            formatContent,
            formatDate,
            formatReadCount,
            commentPost,
            likePost,
            deleteMyPost,
        }
    },
}
</script>

<style>
.orange {
    color: #eb7350;
}
.tenpx-l-r {
    margin: 0 10px 0;
}
.flex-box {
    display: flex;
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
</style>

<style scoped>
.hover-orign:hover{
    color: #eb7350;
}
.total-count {
    margin: 0 20px 0;
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
</style>