<template>
    <div class="my-info">
        <div class="my-image">
            <el-avatar class="my-avatar" shape="square" :size="100" :fit="fit" :src="avatarUrl" />
        </div>
        <div class="username">
            {{ userName }}
        </div>
        <div class="follow-count">
            关注数：{{ followCount }}
        </div>
        <div class="followed-count">
            粉丝数：{{ followedCount }}
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: "MyProfile",
    setup() {
        const store = useStore();
        const fit = "cover";
        let avatarUrl = computed(() => store.state.user.avatarUrl);
        let userName = computed(() => store.state.user.userName);
        let followCount = computed(() => store.state.follow.followCount);
        let followedCount = computed(() => store.state.follow.followedCount);
        // const getFollowCount = () => {
        //     store.dispatch("getFollowCount");
        // };
        // const getFollowedCount = () => {
        //     store.dispatch("getFollowedCount");
        // }

        return {
            fit,
            avatarUrl,
            userName,
            followCount,
            followedCount,
        }
    }
}
</script>

<style scoped>
.my-image {
    float: left;
    margin-right: 10px;
}
.my-avatar {
    cursor: pointer;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 1px rgba(0,0,0,0.3);
}
</style>