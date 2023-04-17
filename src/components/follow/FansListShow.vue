<template>
    <el-dialog 
        v-model="visible" 
        title="粉丝信息" 
        width="30%" 
        :before-close="handleClose"
        lock-scroll
        center
    >
        <div class="fans-module">
            <div v-infinite-scroll="loadMoreFans" :infinite-scroll-disabled="scrollDisabled">
                <el-row class="fans-single" v-for="(fansInfo, index) of fansList" :key="index">
                    <el-col :span="3">
                        <el-avatar class="fans-avatar" :src="fansInfo.AvatarUrl" :size="40"></el-avatar>
                    </el-col>
                    <el-col :span="15">
                        <el-row>
                            <div class="fans-username text-overflow">{{ fansInfo.UserName }}</div>
                            <div class="fans-signature text-overflow">{{ fansInfo.PersonalSignature }}</div>
                        </el-row>
                    </el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="5">
                        <el-button 
                            v-if="!fansInfo.IsFollowed"
                            class="fans-follow-btn" 
                            @click="addFollow(fansInfo.UserId)" 
                            round
                        >
                            回粉
                        </el-button>
                        <el-button 
                            v-if="fansInfo.IsFollowed"
                            class="fans-follow-btn" 
                            @click="cancelFollow(fansInfo.UserId, index)" 
                            round
                        >
                            取消关注
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <p class="load-text" v-if="loading">Loading...</p>
            <p class="load-text" v-if="noMore">所有粉丝已加载完毕~</p>
        </div>
    </el-dialog>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: "FansListShow",
    setup() {
        const store = useStore();
        let visible = computed({
            get() {
                return store.state.user.fansListVisible;
            },
            set() {
            }
        });
        let fansList = computed({
            get() {
                return store.state.user.fansList;
            },
            set() {
            }
        });
        const loading = ref(false);
        const noMore = ref(false);
        let scrollDisabled = computed(() => loading.value || noMore.value);
        const handleClose = () => {
            store.commit("updateFansListVisible", false);
        };
        const loadMoreFans = () => {
            loading.value = true;
            store.dispatch("getFansList", {
                param: {
                    PageIndex: store.state.user.fansListPageIndex,
                    MyUserId: store.state.user.userId
                },
                success(result) {
                    loading.value = false;
                    if (result.Items.length == 0) {
                        noMore.value = true;
                    } else {
                        store.commit("addFansList", result.Items);
                    }
                },
                error(message) {
                    loading.value = false;
                    ElMessage.error(message);
                }
            });
        };
        const addFollow = (userId) => {
            store.dispatch("getFollowGroupList", {
                success(result) {
                    store.commit("updateAddFollowPageType", 1);
                    store.commit("refreshFollowGroupList", result);
                    store.commit("updateAddFollowShowGroupVisible", {
                        Status: true,
                        UserId: userId
                    });
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        const cancelFollow = (userId, index) => {
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
                        store.commit("updateFansUserFollowStatusByIndex", {
                            Index: index,
                            Status: false
                        });
                        store.commit("updateFollowCountWithCancel");
                        ElMessage({
                            type: 'success',
                            message: "已取消关注",
                        });
                    },
                    error(message) {
                        ElMessage.error(message);
                    }
                })
            }).catch(() => {
                // 点击取消按钮后执行的操作
            });
        };
        return {
            visible,
            fansList,
            loading,
            noMore,
            scrollDisabled,
            handleClose,
            loadMoreFans,
            addFollow,
            cancelFollow,
        }
    }
}
</script>

<style scoped>
.fans-module {
    overflow: hidden;
    height: 500px;
}
.fans-single {
    align-items: center;
    margin-bottom: 10px;
}
.load-text {
    text-align: center;
    font-size: 14px;
    color: #939393;
    margin: 20px 0 30px 0;
}
.text-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.fans-username {
    font-size: 16px;
}
.fans-signature {
    font-size: 13px;
    color: gray;
}
.fans-follow-btn {
    width: 100%;
}
</style>