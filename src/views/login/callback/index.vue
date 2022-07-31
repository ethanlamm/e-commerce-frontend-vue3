<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind></CallbackBind>
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch></CallbackPatch>
    </div>
  </section>
  <LoginFooter></LoginFooter>
</template>

<script>
import LoginHeader from '../components/login-header.vue'
import LoginFooter from '../components/login-footer.vue'
import CallbackBind from './components/callback-bind.vue'
import CallbackPatch from './components/callback-patch.vue'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import Message from '@/components/library/message'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallBack',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup (props) {
    const store = useStore()
    const router = useRouter()

    // 两个表单的切换
    const hasAccount = ref(true)
    // loading图
    const isBind = ref(true)

    // 1.QQ登录后，跳转至 /login/callback 页面，即当前页面
    // 2.初始化时(setup)获取openId
    // 3.根据openId去后台登录检验
    // 4.若请求成功，表示有账号并且QQ已绑定，存储返回用户信息，跳转至来源页或首页
    // 5.若请求失败，展示两个表单进行绑定(有账号，QQ未登录；无账号，QQ未登录)

    // 确保已登录
    if (QC.Login.check()) {
      QC.Login.getMe((openId) => {
        userQQLogin(openId)
          .then((data) => {
            // 存储用户信息
            const { id, account, avatar, mobile, nickname, token } =
              data.result
            store.commit('user/setUser', {
              id,
              account,
              avatar,
              mobile,
              nickname,
              token
            })
            // 跳转至来源页或首页
            // 当前页是 '/login/callback'，而 redirectUrl 是在 '/login' 路径下的 query上
            // 因此在 '/login' 跳转至QQ登录前，先将redirectUrl存储与vuex中(在login/index.vue中完成)
            // 在QQ登录后，跳转至 '/login/callback' ，登录成功后，再将redirectUrl取出，再跳转至redirectUrl
            router.push(store.state.user.redirectUrl)
            // 提示登录成功
            Message('登录成功', 'success')
          })
          .catch((e) => {
            // 代表QQ未绑定，展示两个表单
            isBind.value = false
            Message('QQ未绑定，请先完善信息')
          })
      })
    }

    return { hasAccount, isBind }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
