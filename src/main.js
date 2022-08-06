import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// mockjs
import '@/mock'
// 引入样式
import 'normalize.css'
// 引入样式重置
import '@/assets/styles/common.less'
// 引入自定义插件
import UI from '@/components/library'

createApp(App).use(store).use(router).use(UI).mount('#app')
