<template>
    <el-dialog 
        v-model="visible" 
        title="删除关注组(组内关注信息将移至默认组)" 
        width="30%" 
        :before-close="handleClose"
        lock-scroll
        top="15%"
    >
        <div class="delete-follow-group-module">
            <el-select v-model="selectedValue" filterable clearable placeholder="请选择要删除的组别">
                <el-option
                v-for="item in selectValue"
                :key="item.GroupId"
                :label="item.GroupName"
                :value="item.GroupId"
                />
            </el-select>
            <el-button type="primary" @click="deleteFollowGroupConfirm">
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
    name: "DeleteFollowGroup",
    setup() {
        const store = useStore();
        let selectValue = computed({
            get() {
                let list = store.state.follow.followGroupList.slice();
                return list.filter(x => x.GroupName != "默认");
            },
            set() {
            }
        });
        let selectedValue = ref(null);
        let visible = computed({
            get() {
                return store.state.follow.deleteFollowGroupVisible;
            },
            set() {
            }
        });
        const hideForm = () => {
            store.commit("updateDeleteFollowGroupVisible", false);
            selectedValue.value = null;
        };
        const handleClose = () => {
            hideForm();
        };
        const deleteFollowGroupConfirm = () => {
            if (selectedValue.value == null || selectedValue.value == "") {
                ElMessage.error("请选择要删除的关注组！");
                return ;
            }
            store.dispatch("deleteFollowGroup", {
                GroupId: selectedValue.value,
                success() {
                    store.dispatch("getFollowGroupList", {
                        success(result) {
                            store.commit("refreshFollowGroupList", result);
                            ElMessage({
                                type: 'success',
                                message: `删除成功`,
                            });
                            hideForm();
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
        };
        return {
            visible,
            selectValue,
            selectedValue,
            handleClose,
            deleteFollowGroupConfirm,
        }
    }
}
</script>

<style scoped>
.delete-follow-group-module {
    display: flex;
    justify-content: space-between;
}
</style>