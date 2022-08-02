import { getNewCartGoods } from '@/api/cart'

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
    // 加入购物车
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
    },
    // 更新购物车
    UPDATECART (state, goods) {
      // goods为单个要更新的商品
      // 找到要更新的商品
      const goodsToUpdate = state.list.find(item => item.skuId === goods.skuId)
      if (goodsToUpdate) {
        for (const key in goods) {
          // 更新需要排除不合法字段的 值
          if (goods[key] !== null && goods[key] !== undefined & goods[key] !== '') {
            goodsToUpdate[key] = goods[key]
          }
        }
      }
    },
    // 删除单个商品
    DELETEGOODS (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }

  },

  actions: {
    // 由于有异步和同步，则同一封装为异步，返回一个Promise

    // 加入购物车
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
    },

    // 更新购物车
    updateCart (ctx) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        // 不同模块之间获取数据 ctx.rootState
        if (ctx.rootState.user.profile.token) {
          // 已登录
          alert('已登录，调用api')
        } else {
          // 未登录
          // 调用api( getNewCartGoods(skuId) )，查询最新商品信息
          // 由于接口每次只能查询一个，因此可用Promise.all()一次发出所有请求
          // Promise.all(promise数组).then((所有返回的数据数组)=>{})
          // 解析：需要得到一个数组，且该数组的元素依赖于另一个数组中的数据(skuId) ==> map方法
          const promiseArr = ctx.state.list.map(item => getNewCartGoods(item.skuId))
          // then:所有promise成功后
          Promise.all(promiseArr).then(datalist => {
            // 数据处理
            datalist.forEach((item, index) => {
              // 单个商品commit
              ctx.commit('UPDATECART', { skuId: ctx.state.list[index].skuId, ...item.result })
            })
            // promise成功，该action返回成功
            resolve()
          }).catch(e => { })
        }
      })
    },
    // 删除单个商品
    deleteGoods (ctx, skuId) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        // 不同模块之间获取数据 ctx.rootState
        if (ctx.rootState.user.profile.token) {
          // 已登录
          alert('已登录，调用api')
        } else {
          // 未登录
          ctx.commit('DELETEGOODS', skuId)
          resolve()
        }
      })
    }
  }
}
