<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <router-link to="/member">
              <i class="iconfont icon-user"></i>
              {{ profile.account }}
            </router-link>
          </li>
          <li><a href="javascript:;" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
          <li><router-link to="/login">请先登录</router-link></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><router-link to="/member/order">我的订单</router-link></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'AppTopnav',
  setup (props) {
    const store = useStore()
    const router = useRouter()
    //  用户信息，计算属性--响应式
    const profile = computed(() => {
      return store.state.user.profile
    })

    // 退出登录
    // 1.清空本地存储和vuex存储的用户信息
    // 2.跳转至登录页
    const logout = () => {
      // 本地存储是拿vuex数据存储的，当重置为空对象{}时，本地存储也清空了数据(router/index.js)
      store.commit('user/setUser', {})

      // 退出登录，清空购物车信息(因为这是服务器返回的购物车信息)
      // 即清除服务器的购物信息，区分本地和服务器的购物车信息
      store.commit('cart/SETCART', [])

      router.push('/login')
    }
    return { profile, logout }
  }
}
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
