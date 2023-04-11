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
                    <p class="post-text" v-if="!post.IsCollapsed" v-html="formatContent(post.Content)"></p>
                    <p class="post-text" v-if="post.IsCollapsed" v-html="formatContent(collapsedText(post.Content))"></p>
                    <a class="post-text-a btn" href="#" v-if="post.Content.length > contentCountLimit" @click.prevent="toggleCollapse(post.Id)">
                        {{ post.IsCollapsed ? " 展开" : " 收起" }}
                    </a>
                    <div v-if="post.Images" class="post-list">
                        <el-row style="width: 75%;" :gutter="5">
                            <el-col v-for="imageUrl in post.Images.split(';')" :key="imageUrl" :span="8">
                                <div style="position: relative;">
                                    <el-image class="single-image" :src="imageUrl"></el-image>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-main>
                <el-footer class="flex-box post-footer">
                    <div class="flex-box flex-center post-comment btn hover-orign post-footer-comment" @click="commentPost">
                        评论&nbsp;{{ post.CommentCount }}
                    </div>
                    <div class="flex-box flex-center post-like btn hover-orign post-footer-like" @click="likePost">
                        点赞&nbsp;{{ post.LikeCount }}
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
    setup() {
        const store = useStore();
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
                    list[i]["IsCollapsed"] = true;
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
        const contentCountLimit = ref(150);
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
        const likePost = () => {
            alert("点赞");
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
        return {
            postTotalCount,
            postList,
            avatarUrl,
            userName,
            contentCountLimit,
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
    color: #eb7350;;
}
</style>