export default {
  namespaced: true,
  state: {
    profile: {
      id: '',
      avatar: '',
      nickname: '',
      account: '',
      mobile: '',
      token: ''
    }
  },

  getters: {},

  actions: {},

  mutations: {
    setUser (state, data) {
      state.profile = data
    }
  }
}
