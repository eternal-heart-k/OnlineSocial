<template>
    <div class="image-preview">
        <el-image-viewer 
            v-if="nowImagePreview" 
            :url-list="[nowImagePreview]"
            :hide-on-click-modal="true"
            @close="closeImagePre"
        />
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: "ImagePreview",
    setup() {
        const store = useStore();
        let nowImagePreview = computed({
            get() {
                return store.state.nowImagePreview;
            },
            set() {

            }
        });
        const closeImagePre = () => {
            store.commit("clearNowImagePreview");
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
        return {
            nowImagePreview,
            closeImagePre,
        };
    },
}
</script>

<style scoped>
.image-preview {
    position: fixed; 
    z-index: 9999;
}
</style>