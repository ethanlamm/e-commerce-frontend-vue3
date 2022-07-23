import { createStore } from 'vuex'
// vuex持久化
import createPersistedstate from 'vuex-persistedstate'

// 引入其他仓库
import cart from './modules/cart'
import category from './modules/category'
import uer from './modules/user'

export default createStore({
  modules: {
    cart, category, uer
  },
  plugins: [
    createPersistedstate({
      key: 'erabbit-store',
      paths: ['user', 'cart']
    })
  ]
})
