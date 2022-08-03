import { getNewCartGoods, mergeCart, getCartList, addToCart } from '@/api/cart'

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
        // 新商品数量增加
        data.count += state.list[index].count
        // 删除旧商品
        state.list.splice(index, 1) // splice 会修改原数组
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
    },
    // 修改购物车数据
    SETCART (state, list) {
      state.list = list
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
          const { skuId, count } = skuInfo
          addToCart({ skuId, count }).then(() => {
            // 更新列表
            return getCartList()
          }).then(data => {
            ctx.commit('SETCART', data.result)
            resolve()
          })
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
          getCartList().then(data => {
            ctx.commit('SETCART', data.result)
            // 登录后，跳转至首页，首页头部的cart组件初始化，dispatch => updateCart => 走登录流程 => 获取服务器的购物车信息 => commit => SETCART => state.list 为服务器最新购物车信息 => 首页头部cart组件和购物车页面的信息，都是依据 state.list => getters => 因此均为最新服务器购物车信息
            resolve()
          })
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
    },

    // 更改商品规格
    // 解析：传入的数据----旧的skuId、不完整的skuInfo
    // 1.拿旧的skuId，找到旧商品
    // 2.删除旧商品(每个商品的skuId都不一样，修改过后，旧商品则没有存在的意义)
    // 3.旧商品信息与传入的不完整的skuInfo合并出一个完整的新商品
    // 4.将新商品加入购物车
    changeGoods (ctx, { oldSkuId, skuInfo }) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        // 不同模块之间获取数据 ctx.rootState
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          if (oldGoods) {
            ctx.commit('DELETEGOODS', oldSkuId)
          }
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = skuInfo
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          ctx.commit('ADDCART', newGoods)
          resolve()
        }
      })
    },

    // 合并购物车
    async mergeCart (ctx) {
      // 1.整理参数 [{skuId,selected,count}...]
      const reqParams = ctx.state.list.map(item => {
        return {
          skuId: item.skuId,
          selected: item.selected,
          count: item.count
        }
      })
      // 2.发请求
      await mergeCart(reqParams) // 无返回值
      // 3.请求成功后，清空本地购物车信息
      ctx.commit('SETCART', [])
    }
  }
}
