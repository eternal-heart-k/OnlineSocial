<template>
    <el-dialog 
        v-model="visible" 
        width="35%" 
        :before-close="handleClose"
        :lock-scroll="true"
        title="关注组信息"
        center
        class="follow-group-module"
    >
        <div class="follow-group-module-inner">
            <div class="follow-group-options">
                <el-button type="success" @click="addFollowGroup">添加关注组</el-button>
                <el-button type="danger" @click="deleteFollowGroup">删除关注组</el-button>
            </div>
            <el-scrollbar class="follow-group-show">
                <el-collapse class="follow-group-content" v-model="activeNames" @change="changeFollowInfoStatus">
                    <el-collapse-item 
                        v-for="(followInfos, groupIndex) of followGroupList" 
                        :key="groupIndex" 
                        class="follow-group-single"
                        :title="formatGroupName(followInfos)"
                        :name="followInfos.GroupName"
                    >
                        <div class="follow-group-follow-module">
                            <div 
                                class="follow-group-follow-single flex" 
                                v-for="(followInfo, followIndex) of followInfos.FollowInfoList" 
                                :key="followIndex"
                            >
                                <div class="follow-group-follow-userinfo flex">
                                    <div @mouseenter="getShowContentValue(followInfo.ToUserId)" @mouseleave="tooltipStatus = false">
                                        <el-tooltip :content="hotPostUserContentValue" effect="customized" placement="top" v-model="tooltipStatus">
                                            <el-avatar class="follow-group-follow-avatar" :size="35" :src="followInfo.AvatarUrl" />
                                        </el-tooltip>
                                    </div>
                                    
                                    <div class="follow-group-follow-username">{{ followInfo.UserName }}</div>
                                </div>
                                <div class="follow-group-follow-options flex">
                                    <el-button size="small" type="danger" @click="cancelFollow(followInfo.Id)" :round="true">
                                        取消关注
                                    </el-button>
                                    <el-button size="small" type="warning" @click="changeFollowGroup(followInfo.Id, followIndex, groupIndex)" :round="true">
                                        更换组别
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-scrollbar>
        </div>
    </el-dialog>
    <ChangeFollowGroup />
    <DeleteFollowGroup />
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import ChangeFollowGroup from './ChangeFollowGroup.vue';
import DeleteFollowGroup from './DeleteFollowGroup.vue';

export default {
    name: "FollowGroupShow",
    components: {
        ChangeFollowGroup,
        DeleteFollowGroup,
    },
    setup() {
        const store = useStore();
        let visible = computed({
            get() {
                return store.state.follow.followGroupVisible;
            },
            set() {
            }
        });
        const hideForm = () => {
            store.commit("updateFollowGroupVisible", false);
        };
        const handleClose = () => {
            hideForm();
        };
        let activeNames = ref([]);
        let followGroupList = computed({
            get() {
                return store.state.follow.followGroupList;
            },
            set() {
            }
        });
        const changeFollowInfoStatus = (names) => {
            console.log(names);
            // store.commit("updateFollowInfoVisible", {
            //     Index: index,
            //     Status: !status
            // });
        };
        const cancelFollow = (id) => {
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
                store.dispatch("cancelFollow", {
                    Id: id,
                    success() {
                        store.dispatch("getFollowGroupList", {
                            success(result) {
                                store.commit("refreshFollowGroupList", result);
                                store.commit("updateFollowCountWithCancel");
                                ElMessage({
                                    type: 'success',
                                    message: "已取消关注",
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
                })
            }).catch(() => {
                // 点击取消按钮后执行的操作
            });
        };
        const changeFollowGroup = (followId, followIndex, groupIndex) => {
            console.log(followId, followIndex, groupIndex);
            store.commit("refreshSelectValue", {
                FollowGroupIndex: groupIndex,
                FollowId: followId,
                FollowIndex: followIndex
            });
            store.commit("updateChangeFollowGroupVisible", true);
        };
        const formatGroupName = (followGroupInfo) => {
            let count = followGroupInfo.FollowInfoList == null ? 0 : followGroupInfo.FollowInfoList.length;
            return followGroupInfo.GroupName + "(" + count + ")";
        };
        const addFollowGroup = () => {
            ElMessageBox.prompt('添加关注组', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                inputPlaceholder: "请输入你的新增关注组名称"
            })
            .then(({ value }) => {
                store.dispatch("addFollowGroup", {
                    param: {
                        UserId: store.state.user.userId,
                        GroupName: value
                    },
                    success() {
                        store.dispatch("getFollowGroupList", {
                            success(result) {
                                store.commit("refreshFollowGroupList", result);
                                ElMessage({
                                    type: 'success',
                                    message: `添加成功`,
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
            })
            .catch(() => {});
        };
        const deleteFollowGroup = () => {
            store.commit("updateDeleteFollowGroupVisible", true);
        };
        let tooltipStatus = ref(false);
        let hotPostUserContentValue = ref("");
        const getShowContentValue = (userId) => {
            store.dispatch("getCountInfoByUserId", {
                UserId: userId,
                success(result) {
                    hotPostUserContentValue.value = result;
                    tooltipStatus.value = true;
                },
                error(message) {
                    hotPostUserContentValue.value = message;
                    tooltipStatus.value = true;
                }
            });
        };
        return {
            visible,
            followGroupList,
            activeNames,
            tooltipStatus,
            hotPostUserContentValue,
            getShowContentValue,
            handleClose,
            changeFollowInfoStatus,
            cancelFollow,
            changeFollowGroup,
            formatGroupName,
            addFollowGroup,
            deleteFollowGroup,
        }
    }
}
</script>

<style>
.follow-group-module .el-dialog__header {
    padding-bottom: 0;
}
.follow-group-module .el-dialog__header .el-dialog__headerbtn {
    top: 0;
    width: 25px;
    height: 0;
    font-size: 22px;
}
.follow-group-single .el-collapse-item__header {
    font-size: 16px;
    margin-left: 10px;
}
.flex {
    display: flex;
}
.follow-group-single .el-collapse-item__wrap .el-collapse-item__content {
    padding-bottom: 0;
}
</style>

<style scoped>
.follow-group-content {
    padding-right: 10px;
}
.follow-group-options {
    margin-bottom: 10px;
}
.follow-group-show {
    height: 400px; 
    overflow: auto;
}
.follow-group-follow-single {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.follow-group-follow-userinfo {
    margin-left: 20px;
    align-items: center;
}
.follow-group-follow-username {
    margin-left: 10px;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 16px;
}
.follow-group-follow-options {
    align-items: center;
    margin-right: 20px;
}
</style>