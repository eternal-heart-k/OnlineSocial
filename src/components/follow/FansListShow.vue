<template>
    <el-dialog 
        v-model="visible" 
        title="粉丝信息" 
        width="30%" 
        :before-close="handleClose"
        lock-scroll
        center
        class="fans-dialog"
    >
        <el-scrollbar class="fans-module">
            <div v-infinite-scroll="loadMoreFans" :infinite-scroll-disabled="scrollDisabled">
                <el-row class="fans-single" v-for="(fansInfo, index) of fansList" :key="index">
                    <el-col :span="3">
                        <el-tooltip :content="fansInfo.ShowContent" effect="customized" placement="top">
                            <el-avatar class="fans-avatar" :src="fansInfo.AvatarUrl" :size="40"></el-avatar>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="15">
                        <div class="fans-single-main">
                            <div class="fans-username text-overflow">{{ fansInfo.UserName }}</div>
                            <div class="fans-signature text-overflow">{{ fansInfo.PersonalSignature }}</div>
                        </div>
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
        </el-scrollbar>
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
                let list = store.state.user.fansList;
                for (let i = 0; i < list.length; i ++ ) {
                    list[i]["ShowContent"] = `关注 ${list[i].FollowCount}\t粉丝 ${list[i].FansCount}`;
                }
                return list;
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
    overflow: auto;
    height: 400px;
}
.fans-single {
    align-items: center;
    margin-bottom: 10px;
    margin-right: 20px;
}
.fans-single-main {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
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
.fans-avatar {
    cursor: pointer;
}
</style>