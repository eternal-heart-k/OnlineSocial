import { createStore } from 'vuex'
import ModuleUser from './user';
import ModuleFollow from './follow';
import ModuleProfile from './profile';
import ModulePost from './post';
import ModuleComment from './comment';
import { ElMessage } from 'element-plus';

export default createStore({
  state: {
    urlPre: "https://localhost:7030", // "https://kanghui29.cn" "https://localhost:7030"
    unAuthorize: "身份认证已过期，请重新登录",
    nowImagePreview: null,
    addFollowPageType: 0, // 0热门页；1个人空间页
  },
  getters: {
  },
  mutations: {
    setNowImagePreview(state, data) {
      state.nowImagePreview = data;
    },
    clearNowImagePreview(state) {
      state.nowImagePreview = null;
    },
    updateAddFollowPageType(state, data) {
      state.addFollowPageType = data;
    }
  },
  actions: {
    beforeAction(context, data) {
      if (!context.rootState.user.isLogin) {
        ElMessage.error("暂未登录，请先登录");
        return;
      }
      data.func();
    }
  },
  modules: {
    user: ModuleUser,
    follow: ModuleFollow,
    profile: ModuleProfile,
    post: ModulePost,
    comment: ModuleComment,
  }
})
