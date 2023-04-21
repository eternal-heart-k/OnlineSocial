<template>
    <div class="hot-post-module">
        <el-row>
            <el-col :span="3"></el-col>
            <el-col :span="4">
                <el-card shadow="always" class="hot-post-left"> 
                    <div class="hot-post-left-text">帖子时间范围</div>
                    <div class="hot-post-left-single hot-post-left-all btn">
                        <el-button class="width-all btn-selected-color" :class="{btn_selected_color: rangeType == 0}" :round="true"  @click="changeHotPostRangeType(0)">
                            所有
                        </el-button>
                    </div>
                    <div class="hot-post-left-single hot-post-left-day btn">
                        <el-button class="width-all" :class="{btn_selected_color: rangeType == 1}" :round="true" @click="changeHotPostRangeType(1)">
                            一天内
                        </el-button>
                    </div>
                    <div class="hot-post-left-single hot-post-left-week btn">
                        <el-button class="width-all" :class="{btn_selected_color: rangeType == 2}" :round="true" @click="changeHotPostRangeType(2)">
                            一周内
                        </el-button>
                    </div>
                    <div class="hot-post-left-single hot-post-left-month btn">
                        <el-button class="width-all" :class="{btn_selected_color: rangeType == 3}" :round="true" @click="changeHotPostRangeType(3)">
                            一月内
                        </el-button>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10" class="hot-post-main">
                <HotPostShowInfo ref="hotPostShowInfoRef" />
            </el-col>
            <el-col :span="5">
                <el-card shadow="always" class="hot-post-right">
                    <div class="hot-user">
                        <div class="hot-user-top">
                            热门用户
                        </div>
                        <div class="hot-user-list">
                            <div 
                                class="hot-user-single" 
                                v-for="(hotUserInfo, index) of hotUserInfos" 
                                :key="index"
                            >
                                <div class="hot-user-left">
                                    <el-tooltip :content="hotUserInfo.ShowContent" effect="customized" placement="top">
                                        <el-avatar style="cursor: pointer;" :size="50" :src="hotUserInfo.AvatarUrl" />
                                    </el-tooltip>
                                </div>
                                <div class="hot-user-main">
                                    <div class="hot-user-username">
                                        {{ hotUserInfo.UserName }}
                                    </div>
                                    <div class="hot-user-signature">
                                        {{ hotUserInfo.PersonalSignature }}
                                    </div>
                                </div>
                                <div class="hot-user-right">
                                    <el-button 
                                        v-if="!hotUserInfo.IsFollowed && hotUserInfo.UserId != myUserId"  
                                        :round="true" 
                                        @click="changeHotUserFollowStatus(true, hotUserInfo.UserId, index)">
                                        关注
                                    </el-button>
                                    <el-button 
                                        v-if="hotUserInfo.IsFollowed && hotUserInfo.UserId != myUserId"  
                                        :round="true" 
                                        @click="changeHotUserFollowStatus(false, hotUserInfo.UserId, index)">
                                        取关
                                    </el-button>
                                </div>
                            </div>
                        </div>
                        <div class="hot-user-footer">
                            <div class="hot-user-footer-page">
                                <el-pagination 
                                    class="mt-4 justify-content-center" 
                                    background layout="prev, pager, next" 
                                    v-model:total="totalCount" 
                                    :pager-count="5"
                                    :page-size="5"
                                    v-model:current-page="currentPageIndex"
                                    @current-change="hotUserPageChanged"
                                />
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import HotPostShowInfo from '../components/post/HotPostShowInfo.vue';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: "HomeMainView",
    components: {
        HotPostShowInfo,
    },
    setup() {
        const store = useStore();
        let rangeType = computed({
            get() {
                return store.state.post.hotRangeType;
            },
            set() {
            }
        });
        const hotPostShowInfoRef = ref(null);
        const changeHotPostRangeType = (type) => {
            store.commit("updateHotRangeType", type);
            if (!store.state.user.isLogin) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
            hotPostShowInfoRef.value.noMore = false;
            hotPostShowInfoRef.value.loadMorePost();
        };

        let currentPageIndex = ref(1);
        const pageCountLimit = ref(3);
        const totalCount = computed({
            get() {
                return store.state.post.hotUserTotalCount;
            },
            set() {
            }
        });
        let hotUserInfos = computed({
            get() {
                let list = store.state.post.hotUserList;
                for (let i = 0; i < list.length; i ++ ) {
                    list[i]["ShowContent"] = `关注 ${list[i].FollowCount}\t粉丝 ${list[i].FansCount}`;
                }
                return list;
            },
            set() {
            }
        });
        const changeHotUserFollowStatus = (status, userId, index) => {
            if (status) {
                store.dispatch("getFollowGroupList", {
                    success(result) {
                        store.commit("refreshFollowGroupList", result);
                        store.commit("updateFollowHotUserListIndex", index);
                        store.commit("updateAddFollowPageType", 0);
                        store.commit("updateAddFollowShowGroupVisible", {
                            Status: true,
                            UserId: userId
                        });
                    },
                    error(message) {
                        ElMessage.error(message);
                    }
                });
            } else {
                ElMessageBox.confirm('确定不关注此人？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                    type: "warning",
                    customStyle: {
                        width: '300px'
                    }
                }).then(() => {
                    // 点击确定按钮后执行的操作
                    store.dispatch("cancelFollowByUserId", {
                        param: {
                            FromUserId: store.state.user.userId,
                            ToUserId: userId
                        },
                        success() {
                            store.commit("updateHotPostUserFollowStatus", {
                                Status: false,
                                UserId: userId
                            });
                            store.commit("updateFollowCountWithCancel");
                        },
                        error(message) {
                            ElMessage.error(message);
                        }
                    })
                }).catch(() => {
                    // 点击取消按钮后执行的操作
                });
            }
        };
        const hotUserPageChanged = () => {
            store.dispatch("getHotUserList", {
                param: {
                    PageIndex: currentPageIndex.value,
                    MyUserId: store.state.user.userId,
                    PageSize: 5
                },
                success(result) {
                    store.commit("updateHotUserList", result);
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        const myUserId = ref(store.state.user.userId);
        return {
            rangeType,
            hotPostShowInfoRef,
            currentPageIndex,
            pageCountLimit,
            hotUserInfos,
            totalCount,
            myUserId,
            changeHotPostRangeType,
            changeHotUserFollowStatus,
            hotUserPageChanged,
        }
    }
}
</script>

<style scoped>
.justify-content-center {
    justify-content: center;
}
.hot-post-module {
    width: 100%;
}
.hot-post-left {
    position: fixed;
    top: 80px;
    width: 15%;
}
.hot-post-left-text {
    text-align: center;
    font-weight: 600;
    margin-bottom: 10px;
}
.hot-post-main {
    position: relative;
}
.hot-post-left-single {
    padding: 10px 0;
    height: 40px;
}
.width-all {
    width: 100%;
}
.btn_selected_color {
    color:#409eff;
    background-color:#ecf5ff;
    border-color: #c6e2ff;
}
.hot-post-right {
    position: fixed;
    top: 80px;
    width: 20%;
}
.hot-user {

}
.hot-user-top {
    text-align: center;
}
.hot-user-footer {
    margin-top: 20px;
}
.hot-user-footer-page {
    width: 100%;
}
.hot-user-single {
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.hot-user-left {
    width: 20%;
}
.hot-user-main {
    flex: 1;
    align-self: center;
    width: 50%;
    margin-left: 10px;
}
.hot-user-username {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 16px;
}
.hot-user-signature {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 13px;
    color: gray;
    margin-top: 5px;
}
.hot-user-right {
    justify-content: flex-end;
}
</style>