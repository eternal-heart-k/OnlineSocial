<template>
    <div class="hot-post-module">
        <el-row>
            <el-col :span="4"></el-col>
            <el-col :span="4">
                <el-card shadow="always" class="hot-post-left"> 
                    <div class="hot-post-left-text">帖子时间范围</div>
                    <div class="hot-post-left-single hot-post-left-all btn">
                        <el-button class="width-all btn-selected-color" :class="{btn_selected_color: rangeType == 0}" :round="true"  @click="changeHotPostRangeType(0)">
                            所有
                        </el-button>
                    </div>
                    <div class="hot-post-left-single hot-post-left-day btn">
                        <el-button class="width-all" :class="{btn_selected_color: rangeType == 1}" :round="true" @click="changeHotPostRangeType(1)">
                            一天内
                        </el-button>
                    </div>
                    <div class="hot-post-left-single hot-post-left-week btn">
                        <el-button class="width-all" :class="{btn_selected_color: rangeType == 2}" :round="true" @click="changeHotPostRangeType(2)">
                            一周内
                        </el-button>
                    </div>
                    <div class="hot-post-left-single hot-post-left-month btn">
                        <el-button class="width-all" :class="{btn_selected_color: rangeType == 3}" :round="true" @click="changeHotPostRangeType(3)">
                            一月内
                        </el-button>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10" class="hot-post-main">
                <HotPostShowInfo ref="hotPostShowInfoRef" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import HotPostShowInfo from '../components/post/HotPostShowInfo.vue';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';

export default {
    name: "HomeMainView",
    components: {
        HotPostShowInfo,
    },
    setup() {
        const store = useStore();
        let rangeType = computed({
            get() {
                return store.state.post.hotRangeType;
            },
            set() {
            }
        });
        const hotPostShowInfoRef = ref(null);
        const changeHotPostRangeType = (type) => {
            store.commit("updateHotRangeType", type);
            hotPostShowInfoRef.value.noMore = false;
            hotPostShowInfoRef.value.loadMorePost();
        };
        return {
            rangeType,
            hotPostShowInfoRef,
            changeHotPostRangeType,
        }
    }
}
</script>

<style scoped>
.hot-post-module {
    width: 100%;
}
.hot-post-left {
    position: fixed;
    top: 80px;
    width: 15%;
}
.hot-post-left-text {
    text-align: center;
    font-weight: 600;
    margin-bottom: 10px;
}
.hot-post-main {
    position: relative;
}
.hot-post-left-single {
    padding: 10px 0;
    height: 40px;
}
.width-all {
    width: 100%;
}
.btn_selected_color {
    color:#409eff;
    background-color:#ecf5ff;
    border-color: #c6e2ff;
}
</style>