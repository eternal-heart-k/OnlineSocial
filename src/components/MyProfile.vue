<template>
    <div class="my-info">
        <div class="my-image">
            <el-avatar class="my-avatar" shape="square" :size="100" :fit="fit" :src="avatarUrl" />
        </div>
        <div class="username">
            <span>{{ userName }}</span>
        </div>
        <div class="follow-info">
            <a class="follow-count btn" @click="followUserInfoShow">
                关注&nbsp; <span>{{ followCount }}</span>
            </a>
            <a class="followed-count btn" @click="followedUserInfoShow">
                粉丝&nbsp; <span>{{ followedCount }}</span>
            </a>
        </div>
        <div class="signature">
            个性签名：<span>{{ personalSignature }}</span>
        </div>
    </div>
    <div class="update-info">
        <a>asfasfas</a>
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
        let personalSignature = computed(() => {
            let res = store.state.user.personalSignature;
            let maxLen = 20;
            if (res.length > maxLen) {
                return res.slice(0, maxLen) + '...';
            }
            return res;
        });
        const followUserInfoShow = () => {
            alert("关注信息");
        };
        const followedUserInfoShow = () => {
            alert("粉丝信息");
        };
        return {
            fit,
            avatarUrl,
            userName,
            followCount,
            followedCount,
            personalSignature,
            followUserInfoShow,
            followedUserInfoShow,
        }
    }
}
</script>

<style scoped>
.update-info {
    margin-top: 10px;
}
.my-image {
    float: left;
    margin-right: 10px;
}
.my-avatar {
    cursor: pointer;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 1px rgba(0,0,0,0.3);
}
.follow-info {
    margin-top: 10px;
}
.follow-info a {
    color: gray;
}
.follow-count {
    margin-right: 20px;
}
.follow-count:hover {
    color: #eb7350;
}
.followed-count:hover {
    color: #eb7350;
}
.signature {
    margin-top: 10px;
}
</style>