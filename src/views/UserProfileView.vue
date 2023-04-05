<template>
    <div class="user-profile-module">
        <el-row>
            <el-col :span="2"></el-col>
            <el-col :span="6">
                <el-card shadow="always" class="user-profile-left"> 
                    <MyProfile />
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card shadow="always" class="user-profile-right">
                    <MyPostInfos />
                </el-card>
            </el-col>
            <el-col :span="6"></el-col>
        </el-row>
    </div>
</template>

<script>
import MyProfile from '@/components/MyProfile.vue';
import MyPostInfos from '@/components/MyPostInfos.vue';

export default {
    name: "UserProfileView",
    components: {
        MyProfile,
        MyPostInfos,
    }
}
</script>

<style scoped>
.user-profile-module {
    margin-top: 7px;
}
.user-profile-left {
    margin-right: 10px;
    background-color: #FFFFFF;
}
.user-profile-right {
    background-color: #FFFFFF;
}
</style>