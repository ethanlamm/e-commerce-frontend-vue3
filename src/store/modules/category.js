// 引入常量分类，预设赋值给 list，解决数据为返回时的白屏问题
import { topCategory } from '@/api/constant'
// 引入api
import { getCategoryList } from '@/api/category'

export default {
  namespaced: true,
  state: {
    // 首页所有分类数据
    list: topCategory.map(item => ({ name: item }))
  },

  getters: {},

  actions: {
    async getCategory ({ commit }) {
      const { result } = await getCategoryList()
      // 给每个一级分类添加 flag 控制 二级分类的显示于隐藏
      // 默认隐藏
      result.forEach(item => {
        item.flag = false
      })
      commit('GETCATEGORY', result)
    }
  },

  mutations: {
    GETCATEGORY (state, data) {
      state.list = data
    },
    // 二级分类显示和隐藏，依据该一级分类
    SHOW (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.flag = true
    },
    HIDE (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.flag = false
    }
  }
}
