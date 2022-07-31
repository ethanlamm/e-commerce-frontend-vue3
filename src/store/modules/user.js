export default {
  namespaced: true,
  state: {
    profile: {
      id: '',
      avatar: '',
      nickname: '',
      account: '',
      mobile: '',
      token: '',
      redirectUrl: '/'
    }
  },

  getters: {},

  actions: {},

  mutations: {
    setUser (state, data) {
      state.profile = data
    },
    setRedirectUrl (state, data) {
      state.redirectUrl = data
    }
  }
}
