<template>
    <el-dialog 
        title="反馈信息"
        v-model="visible" 
        width="30%" 
        center
        :before-close="handleClose"
    >
        <el-form label-width="20%" @submit.prevent>
            <el-select v-model="feedbackType" class="m-2 feedback-select" placeholder="请选择反馈类型">
                <el-option
                    v-for="item in selectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <el-input 
                v-model="content" 
                :maxlength="300"
                :show-word-limit="true"
                type="textarea"
                resize="none" 
                :autosize="{minRows: 4}"
                placeholder="请填写反馈内容，可同时提供一张图片"
            ></el-input>
        </el-form>
        
        <template #footer>
            <div class="dialog-footer">
                <div class="btn">
                    <el-upload
                        :http-request="(ops) => uploadCommentImage(ops)"
                        :disabled="image != null"
                        :show-file-list="false"
                        >
                        <el-tooltip
                            class="box-item"
                            content="最多一张，不能再多了~"
                            placement="top"
                            effect="light"
                            :disabled="image == null"
                        >
                            <el-icon :size="25"><Picture /></el-icon>
                        </el-tooltip>
                    </el-upload>
                </div>
                <el-button 
                    type="primary" 
                    @click="submitForm" 
                    v-loading.fullscreen.lock="loading"
                    :round="true"
                >回复</el-button>
            </div>
            <div v-if="imagePre" class="image-pre-module">
                <el-image 
                    :lazy="true" 
                    class="image-pre btn" 
                    :src="imagePre" 
                    @click="showImagePre">
                </el-image>
                <div class="image-pre-delete btn hover-orange" @click="removeCommentImage">X</div>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: "FeedbackShow",
    setup() {
        const store = useStore();
        let visible = computed({
            get() {
                return store.state.feedback.feedbackDialogVisible;
            },
            set() {
            }
        });
        let content = ref("");
        let image = ref(null);
        let imagePre = ref(null);
        let loading = ref(false);
        let feedbackType = ref(null);
        const hideForm = () => {
            store.commit("updateFeedbackDialogVisibleStatus", false);
            feedbackType.value = null;
        };
        const clearValue = () => {
            content.value = "";
            feedbackType.value = null;
            image.value = null;
            imagePre.value = null;
        };
        const handleClose = () => {
            if (content.value == "" && image.value == null) {
                hideForm();
                return;
            }
            ElMessageBox.confirm('关闭之后将不保留', {
                title: "确认关闭？",
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: "warning",
                center: true,
                customStyle: {
                    width: '300px'
                }
            })
            .then(() => {
                hideForm();
                clearValue();
            })
            .catch(() => {
                // catch error
            });
        };
        const uploadCommentImage = (ops) => {
            image.value = ops.file;
            const reader = new FileReader();
            reader.readAsDataURL(ops.file);
            reader.onload = () => {
                imagePre.value = reader.result;
            };
        };
        const feedback = (result) => {
            store.dispatch("addFeedback", {
                param: {
                    UserId: store.state.user.userId,
                    Type: feedbackType.value,
                    Content: content.value,
                    Image: result
                },
                success() {
                    loading.value = false;
                    hideForm();
                    clearValue();
                    ElMessage({
                        message: "反馈成功，感谢你的反馈~",
                        type: 'success',
                    });
                },
                error(message) {
                    loading.value  = false;
                    ElMessage.error(message);
                }
            });
        };
        const submitForm = () => {
            if (content.value == "") {
                ElMessage.error("反馈内容不能为空");
                return;
            }
            loading.value = true;
            if (image.value != null) {
                store.dispatch("uploadSingleImage", {
                    File: image.value,
                    success(result) {
                        feedback(result);
                    },
                    error(message) {
                        loading.value  = false;
                        ElMessage.error(message);
                    }
                });
            } else {
                feedback(null);
            }
        };
        const showImagePre = () => {
            store.commit("setNowImagePreview", imagePre.value);
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        };
        const removeCommentImage = () => {
            image.value = null;
            imagePre.value = null;
        };
        const selectOptions = [
            {
                value: 1,
                label: '发现系统Bug',
            },
            {
                value: 2,
                label: '举报不良用户',
            },
            {
                value: 0,
                label: '其他',
            },
        ]
        return {
            visible,
            content,
            image,
            imagePre,
            loading,
            feedbackType,
            selectOptions,
            handleClose,
            uploadCommentImage,
            submitForm,
            showImagePre,
            removeCommentImage,
        }
    }
}
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: space-between;
}
.image-pre-module {
    width: 100px;
    height: 100px;
    position: relative;
}
.image-pre {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
}
.image-pre-delete {
    position: absolute;
    top: 2px;
    right: 2px;
    color: gray;
}
.feedback-select {
    margin-bottom: 20px;
}
</style>