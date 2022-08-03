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
    },
    // 已选择商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选择商品总数量
    selectedCount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      const temp = getters.selectedList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      return temp.toFixed(2)
    },
    // 是否全选：有效商品列表.length === 已选择商品列表.length
    isSelectedAll (state, getters) {
      return getters.validList.length !== 0 && getters.validList.length === getters.selectedList.length
    },
    // 无效商品列表
    invalidList (state) {
      // 无库存或者无效商品
      return state.list.filter(item => !item.stock > 0 || !item.isEffective)
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
        } else {
          // 未登录
          ctx.commit('ADDCART', skuInfo)
          resolve()
        }
      })
    },

    // 更新购物车(整个购物车)
    updateCart (ctx) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        // 不同模块之间获取数据 ctx.rootState
        if (ctx.rootState.user.profile.token) {
          // 已登录
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
        } else {
          // 未登录
          ctx.commit('DELETEGOODS', skuId)
          resolve()
        }
      })
    },
    // 更新购物车中的信息(购物车页面的 全选、单选、数量变化等)
    updateGoodsStatus (ctx, goods) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        // 不同模块之间获取数据 ctx.rootState
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('UPDATECART', goods)
          resolve()
        }
      })
    },
    // 全选
    checkAll (ctx, selected) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        // 不同模块之间获取数据 ctx.rootState
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 遍历购物车中的有效商品列表，逐个改变商品勾选状态
          ctx.getters.validList.forEach(item => {
            ctx.commit('UPDATECART', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },

    // 批量删除商品
    batchDelete (ctx, clearInvalid) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        // 不同模块之间获取数据 ctx.rootState
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 已勾选列表 | 无效列表
          ctx.getters[clearInvalid ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('DELETEGOODS', item.skuId)
          })
          resolve()
        }
      })
    }
  }
}
