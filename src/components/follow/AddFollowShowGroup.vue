<template>
    <el-dialog 
        v-model="visible" 
        title="添加关注" 
        width="30%" 
        :before-close="handleClose"
        lock-scroll
        top="15%"
    >
        <div class="add-follow-show-group-module">
            <el-select v-model="selectedValue" filterable clearable placeholder="请选择关注组">
                <el-option
                v-for="item in selectValue"
                :key="item.GroupId"
                :label="item.GroupName"
                :value="item.GroupId"
                />
            </el-select>
            <el-button type="primary" @click="addFollowShowGroupConfirm">
                确认
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus'

export default {
    name: "AddFollowShowGroup",
    setup() {
        const store = useStore();
        let selectValue = computed({
            get() {
                return store.state.follow.followGroupList;
            },
            set() {
            }
        });
        let selectedValue = ref(null);
        let visible = computed({
            get() {
                return store.state.follow.addFollowShowGroupVisible;
            },
            set() {
            }
        });
        const hideForm = () => {
            store.commit("updateAddFollowShowGroupVisible", {
                Status: false,
                UserId: ""
            });
            selectedValue.value = null;
        };
        const handleClose = () => {
            hideForm();
        };
        const addFollowShowGroupConfirm = () => {
            if (selectedValue.value == null || selectedValue.value == "") {
                ElMessage.error("请选择关注组！");
                return ;
            }
            store.dispatch("followUser", {
                param: {
                    FromUserId: store.state.user.userId,
                    ToUserId: store.state.follow.addFollowUserId,
                    GroupId: selectedValue.value
                },
                success() {
                    if (store.state.addFollowPageType == 0) {
                        store.commit("updateHotPostUserFollowStatus", {
                            Status: true,
                            UserId: store.state.follow.addFollowUserId
                        });
                    } else {
                        store.commit("updateFansUserFollowStatusByUserId", {
                            UserId: store.state.follow.addFollowUserId,
                            Status: true
                        })
                    }
                    ElMessage({
                        type: 'success',
                        message: "关注成功",
                    });
                    store.commit("updateFollowCountWithFollow");
                    hideForm();
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        return {
            visible,
            selectValue,
            selectedValue,
            handleClose,
            addFollowShowGroupConfirm,
        }
    }
}
</script>

<style scoped>
.add-follow-show-group-module {
    display: flex;
    justify-content: space-between;
}
</style>