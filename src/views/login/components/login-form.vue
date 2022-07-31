<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
      ref="FormCom"
      class="form"
      :validation-schema="myScheme"
      v-slot="{ errors }"
    >
      <!-- 用户名密码登录 -->
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              name="account"
              v-model="form.account"
              type="text"
              placeholder="请输入用户名"
              :class="{ error: errors.account }"
            />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              name="password"
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :class="{ error: errors.password }"
            />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <!-- 手机号登录 -->
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              name="mobile"
              v-model="form.mobile"
              type="text"
              placeholder="请输入手机号"
              :class="{ error: errors.mobile }"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              name="code"
              v-model="form.code"
              type="text"
              placeholder="请输入验证码"
              :class="{ error: errors.code }"
            />
            <span
              class="code"
              @click="sendCode"
              :class="{ disabled: time !== 0 }"
            >
              {{ time === 0 ? "发送验证码" : `${time} 秒后重新发送` }}
            </span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />{{ errors.isAgree }}
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <img
        src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
      />
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/message'
import {
  userAccountLogin,
  userMobileLoginMsg,
  userMobileLogin
} from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup (props) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // 默认账号密码登录
    const isMsgLogin = ref(false)

    // 表单验证
    // 1.npm i vee-validate@4.0.3
    // 2.引入 Form、Field，并注册!!!!
    // 3.Form 替换 form 标签、Field 替换 input 标签(若是自定义组件，则加上 as="组件名称"，前提条件 自定义组件须支持v-model)
    // 4.每个 Field 有对应的 name 指定相应的验证函数，同时需要双向数据绑定
    // 5.定义 Form 验证规则(对象)，引入并在 Form 的validation-schema绑定
    // 6.在 Form 中添加 v-slot="{errors}"，通过 errors.验证规则名称 取出错误信息进行展示
    // 双向绑定表单数据
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    // 接收校验规则，并提供给模板使用
    const myScheme = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 切换登录模式，清除之前的数据以及校验结果
    // 清除校验结果：Form 组件提供 resetForm 方法
    const FormCom = ref(null) // Form 组件
    watch(isMsgLogin, () => {
      // 清除数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // v-show 没有销毁组件，则需要清除校验结果，而 v-if 会销毁组件，则不需要清除校验结果
      // FormCom.value.resetForm();
    })

    // 点击登录按钮，整体验证 Form 组件提供 validate 方法，返回 Promise
    const login = async () => {
      const result = await FormCom.value.validate()

      // 如果验证通过
      if (result) {
        let data = null
        try {
          if (!isMsgLogin.value) {
            // 用户名登录
            // 1.收集表单数据，发请求
            // 2.请求成功，存储返回的用户信息，消息提示登录成功，路由跳转(重定向|首页)
            // 3.请求失败，消息提示失败内容
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          } else {
            // 手机号登录
            // 1.收集手机号，验证是否合法
            // 2.发请求(验证码)，60秒倒计时
            // 3.收集表单数据，验证是否合法
            // 4.再次发请求(手机号、验证码)
            // 5.请求成功，存储返回的用户信息，消息提示登录成功，路由跳转(重定向|首页)
            // 6.请求失败，消息提示失败内容
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          }
          // 请求成功
          const { id, avatar, nickname, account, mobile, token } = data.result
          // 存储数据
          store.commit('user/setUser', {
            id,
            avatar,
            nickname,
            account,
            mobile,
            token
          })
          // 路由跳转
          const redirectUrl = route.query.redirectUrl
          router.push(redirectUrl || '/')
          // 提示成功
          Message('登录成功', 'success')
        } catch (err) {
          // 请求失败
          if (err.response) {
            Message(err.response.data.message || '登录失败', 'error')
          }
        }
      }
    }

    // 倒计时
    const time = ref(0)
    // pause 停止定时器 | resume 开启定时器
    // useIntervalFn(间隔时间的回调，间隔时间，是否立即开启定时器)
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      { immediate: false }
    )
    // 组件销毁时，停止定时器
    onUnmounted(() => {
      pause()
    })

    // 点击发送验证码按钮回调
    const sendCode = async () => {
      // 1.收集手机号，验证手机号是否合法
      // 2.发请求(验证码)，60秒倒计时
      // 3.60秒内不能再次请求
      const vaild = myScheme.mobile(form.mobile) // 验证通过 true | 验证不通过 字符串(错误提示)
      if (vaild === true) {
        // 验证通过
        // 但倒计时为0时，才发请求
        if (time.value === 0) {
          // 发请求，验证码
          await userMobileLoginMsg(form.mobile) // 无返回值，默认123456
          // 验证码请求成功，开启倒计时
          time.value = 60
          resume()
        } else {
          return Message('验证码已发送，请注意查收')
        }
      } else {
        // 验证不通过，通过vee的错误函数提示错误信息
        // setFieldError(错误字段，错误信息)
        FormCom.value.setFieldError('mobile', vaild)
      }
    }

    return { isMsgLogin, form, myScheme, FormCom, login, sendCode, time }
  }
}
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 120px;
          height: 34px;
          cursor: pointer;
          // 禁用
          &.disabled {
            cursor: not-allowed;
            opacity: 0.4;
            &:hover {
              color: #333;
            }
          }
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
