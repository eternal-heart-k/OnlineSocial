<template>
    <el-dialog 
        v-model="visible" 
        title="更换组别" 
        width="30%" 
        :before-close="handleClose"
        :lock-scroll="true"
        top="15%"
    >
        <div class="change-follow-group-module">
            <el-select v-model="selectedValue" filterable clearable placeholder="请选择新的组别">
                <el-option
                v-for="item in selectValue"
                :key="item.GroupId"
                :label="item.GroupName"
                :value="item.GroupId"
                />
            </el-select>
            <el-button type="primary" @click="changeFollowGroupConfirm">
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
    name: "ChangeFollowGroup",
    setup() {
        const store = useStore();
        let selectValue = computed({
            get() {
                return store.state.follow.selectValue;
            },
            set() {
            }
        });
        let selectedValue = ref(null);
        let visible = computed({
            get() {
                return store.state.follow.changeFollowGroupVisible;
            },
            set() {
            }
        });
        const hideForm = () => {
            store.commit("updateChangeFollowGroupVisible", false);
            selectedValue.value = null;
        };
        const handleClose = () => {
            hideForm();
        };
        const changeFollowGroupConfirm = () => {
            if (selectedValue.value == null || selectedValue.value == "") {
                ElMessage.error("请选择新的关注组！");
                return ;
            }
            store.dispatch("moveNewFollowGroup", {
                FollowGroupId: selectedValue.value,
                success() {
                    store.dispatch("getFollowGroupList", {
                        success(result) {
                            store.commit("refreshFollowGroupList", result);
                            ElMessage({
                                type: 'success',
                                message: `添加成功`,
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
            })
            
        };
        return {
            visible,
            selectValue,
            selectedValue,
            handleClose,
            changeFollowGroupConfirm,
        }
    }
}
</script>

<style scoped>
.change-follow-group-module {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
</style>