<template>
  <el-dialog title="发布动态" v-model="dialogVisible" width="40%" :before-close="handleClose">
      <div class="post-content">
        <el-input 
          resize="none" 
          :autosize="{minRows: 4}" 
          v-model="content" 
          type="textarea" 
          placeholder="有什么新鲜事分享给大家？" 
          @keydown.tab="insertTab"></el-input>
        <div class="post-content-word-size">
          {{ content.length }}
        </div>
      </div>
      <div class="upload-image-list">
        <el-row style="width: 50%;" :gutter="5">
            <el-col v-for="(imageUrl, index) in previewUrls" :key="index" :span="8">
              <div style="position: relative;">
                <el-image class="single-image" :src="imageUrl" style="width: 100%; height: 100px;"></el-image>
                <div class="image-delete btn" @click="deleteImage(index)">X</div>
              </div>
            </el-col>
        </el-row>
      </div>
    <template #footer>
        <span class="dialog-footer">
          <div class="upload-image-btn">
            <el-upload 
              class="el-upload btn" 
              :multiple="true"
              :disabled="uploadImageDisabled"
              :http-request="uploadImage"
              :show-file-list="false"
              :before-upload="handleImageListChange"
            >
              <el-icon :size="25"><Picture /></el-icon>
              <span>图片</span>
            </el-upload>
            <span class="upload-image-tip">最多9张</span>
          </div>
          <el-button v-loading.fullscreen.lock="loading" type="primary" @click="submitForm">发布</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from 'vuex';
import { ElMessageBox } from 'element-plus';
import { Picture } from "@element-plus/icons";

export default {
  name: "postEdit",
  components: {
    Picture,
  },
  setup() {
    const store = useStore();
    let dialogVisible = computed({
      get() {
        return store.state.post.postEditShow;
      },
      set() {}
    });
    let content = ref("");
    let fileList = ref([]);
    let previewUrls = ref([]);
    let uploadImageDisabled = computed(() => fileList.value.length >= 9);
    const fit = "cover";
    const loading = ref(false);
    const clearValue = () => {
      content.value = "";
      fileList.value = [];
      previewUrls.value = [];
    };
    const hideForm = () => {
      store.dispatch("updatePostEditShow", {
        Status: false
      });
    };
    const handleClose = () => {
      if (content.value == "") {
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
        })
    };
    const submitForm = () => {
      if (content.value == "" && fileList.value.length == 0) {
        alert("发布内容不能为空");
        return;
      }
      loading.value = true;
      store.dispatch("uploadFileList", {
        param: fileList.value,
        success(result) {
          store.dispatch("postAPost", {
            param: {
              UserId: store.state.user.userId,
              Content: content.value,
              Images: result.join(";")
            },
            success() {
              loading.value = false;
              clearValue();
              hideForm();
              setTimeout(() => {
                alert("发布成功");
              }, 300);
            },
            error(message) {
              loading.value = false;
              setTimeout(() => {
                alert(message);
              }, 300);
            }
          })
        }
      });
    };
    const insertTab = (e) => {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newText = `${content.value.substring(0, selectionStart)}\t${content.value.substring(selectionEnd)}`;
      content.value = newText;
      e.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
    };
    const uploadImage = () => {};

    const handleImageListChange = (file) => {
      if (fileList.value.length >= 9) {
        return false;
      }
      fileList.value.push(file);
      previewUrls.value.push("");
      let sz = fileList.value.length;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        previewUrls.value[sz - 1] = reader.result;
      };
      return false;
    };
    const deleteImage = (index) => {
      fileList.value.splice(index, 1);
      previewUrls.value.splice(index, 1);
    };
    return {
      fit,
      dialogVisible,
      content,
      fileList,
      previewUrls,
      uploadImageDisabled,
      loading,
      handleClose,
      submitForm,
      insertTab,
      uploadImage,
      deleteImage,
      handleImageListChange,
    }
  },
};
</script>

<style scoped>
.post-content-word-size {
  font-size: 14px;
  line-height: 24px;
  text-align: right;
}
.upload-image-btn {
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 20px;
  color: gray;
}
.single-image {
  border-radius: 0.5rem;
}
.single-image:hover {
  opacity: 0.8;
}
.image-delete {
  position: absolute;
  top: 2px;
  right: 2px;
  color: gray;
}
.image-delete:hover {
  color: #FF8200;
}
.upload-image-tip {
  font-size: small;
}
</style>