import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElIconModules from '@element-plus/icons';

const app = createApp(App);

for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName]);
}

app.use(ElementPlus);
app.use(store).use(router).mount('#app');

