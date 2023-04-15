<template>
    <div>
        <div class="total-count" style="margin: 0 20px 0;">
            全部帖子({{ postTotalCount }})
        </div>
        <PostShowInfo />
    </div>
</template>

<script>
import PostShowInfo from './post/PostShowInfo.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: "MyPostInfos",
    components: {
        PostShowInfo,
    },
    setup() {
        const store = useStore();
        let postTotalCount = computed({
            get() {
                return store.state.post.myTotalCount;
            },
            set() {
            }
        });
        return {
            postTotalCount,
        }
    }
}
</script>