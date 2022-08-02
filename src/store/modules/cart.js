export default {
  namespaced: true,
  state: {
    list: []
  },

  getters: {
    // 有效商品列表
    validList (state) {
      // 库存大于0，isEffective=true
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总数量
    validCount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      const temp = getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      return temp.toFixed(2)
    }
  },

  mutations: {
    ADDCART (state, data) {
      // 判断是否存在相同商品
      // 若存在，删除原来的商品，新商品数量合并旧商品数量，将新商品放置在第一位
      // 若不存在，直接添加新商品
      const index = state.list.findIndex(sku => sku.skuId === data.skuId)
      if (index !== -1) {
        // 删除旧商品
        state.list.splice(index, 1) // splice 会修改原数组
        // 新商品数量增加
        data.count += state.list[index].count
      }
      // 添加新商品
      state.list.unshift(data)
    }
  },

  actions: {
    // 加入购物车
    // 由于有异步和同步，则同一封装为异步，返回一个Promise
    addCart (ctx, skuInfo) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        // 不同模块之间获取数据 ctx.rootState
        if (ctx.rootState.user.profile.token) {
          // 已登录
          alert('已登录，调用api')
        } else {
          // 未登录
          ctx.commit('ADDCART', skuInfo)
          resolve()
        }
      })
    }
  }
}
