import { createStore } from 'vuex'
import ModuleUser from './user';

export default createStore({
  state: {
    urlPre: "https://localhost:7030", // "https://kanghui29.cn"
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user: ModuleUser,
  }
})
