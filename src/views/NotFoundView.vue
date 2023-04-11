<template>
    <div class="not-found-view">
        <el-row class="not-found-row">
            <el-col :span="24" class="not-found-col">
                <h1>Error 404!</h1>
                <p  class="not-found-col-word">The page you requested does not exist or has moved.</p>
                <p>{{ this.tm }} 秒后跳转到首页...</p>
            </el-col>
        </el-row>
    </div>
</template>
  
<script>
import $ from 'jquery';
import router from '@/router/index';

export default {
    name: 'NotFoundView',
    data() {
        return {
            tm: 10
        }
    },
    mounted() {
        $(".header").hide();
        this.tm = 10;
        let intervalId = setInterval(() => {
            if (this.tm <= 0) {
                $(".header").show();
                clearInterval(intervalId);
                router.push({name: "home"});
            } else {
                this.tm --;
            }
        }, 1000);
    }
    
};
</script>
  
<style scoped>
.not-found-view {
    height: 100%;
    width: 100%;
    position: fixed;
}
.not-found-row {
    top: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.not-found-col {
    text-align: center;
}
.not-found-col h1 {
    color: #222;
    font-size: 4rem;
    font-weight: 900;
    line-height: 100%;
    margin-bottom: 20px;
}
.not-found-col-word {
    color: #999;
    margin-bottom: 20px;
}
</style>
  