import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import TRTC from 'trtc-js-sdk';
import 'element-plus/dist/index.css';
import router from './router';
// import store from './store'
import App from './App.vue';
const app = createApp(App);
TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.DEBUG);


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus).use(router);
app.mount('#app');