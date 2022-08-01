<template>
  <Form
    class="xtx-form"
    ref="FormCom"
    :validation-schema="mySchema"
    v-slot="{ errors }"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          :class="{ err: errors.account }"
          name="accountApi"
          v-model="form.account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error" v-if="errors.accountApi">
        <i class="iconfont icon-warning" />{{ errors.accountApi }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.mobile }"
          name="mobile"
          v-model="form.mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">
        <i class="iconfont icon-warning" />{{ errors.mobile }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{ err: errors.code }"
          name="code"
          v-model="form.code"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span
          class="code"
          @click="sendCode"
          :class="{ disabled: time !== 0 }"
          >{{ time === 0 ? "发送验证码" : `${time} 秒后重新发送` }}</span
        >
      </div>
      <div class="error" v-if="errors.code">
        <i class="iconfont icon-warning" />{{ errors.code }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ err: errors.password }"
          name="password"
          v-model="form.password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="errors.password">
        <i class="iconfont icon-warning" />{{ errors.password }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ err: errors.rePassword }"
          name="rePassword"
          v-model="form.rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="errors.rePassword">
        <i class="iconfont icon-warning" />{{ errors.rePassword }}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const FormCom = ref(null)
    // 校验规则
    const mySchema = {
      accountApi: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }
    // 收集数据
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })

    // ----------------------倒计时-----------------------
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

    // ----------------------发送验证码---------------------
    // 点击发送验证码按钮回调
    const sendCode = async () => {
      // 1.收集手机号，验证手机号是否合法
      // 2.发请求(验证码)，60秒倒计时
      // 3.60秒内不能再次请求
      const vaild = mySchema.mobile(form.mobile) // 验证通过 true | 验证不通过 字符串(错误提示)
      if (vaild === true) {
        // 验证通过
        // 但倒计时为0时，才发请求
        if (time.value === 0) {
          try {
            // 发请求，验证码
            await userQQPatchCode(form.mobile) // 无返回值，默认123456
            // 验证码请求成功，开启倒计时
            time.value = 60
            resume()
            Message('发送成功', 'success')
          } catch (error) {
            if (error.response) {
              Message(error.response.data.message || '手机号已被绑定', 'error')
            }
          }
        } else {
          return Message('验证码已发送，请注意查收')
        }
      } else {
        // 验证不通过，通过vee的错误函数提示错误信息
        // setFieldError(错误字段，错误信息)
        FormCom.value.setFieldError('mobile', vaild)
      }
    }

    // --------------------------立即提交---------------------------
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const result = await FormCom.value.validate()
      if (result) {
        userQQPatchLogin({
          unionId: props.unionId,
          ...form
        })
          .then((data) => {
            // 请求成功
            const { id, avatar, nickname, account, mobile, token } =
              data.result
            // 存储数据
            store.commit('user/setUser', {
              id,
              avatar,
              nickname,
              account,
              mobile,
              token
            })
            // 跳转
            router.push(store.state.user.redirectUrl || '/')
            // 提示成功
            Message('信息已完善', 'success')
          })
          .catch((e) => {
            if (e.response) {
              Message(e.response.data.message, 'error')
            }
          })
      }
    }

    return { FormCom, mySchema, form, sendCode, time, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  text-align: center;
  width: 120px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
  // 禁用
  &.disabled {
    cursor: not-allowed;
    opacity: 0.4;
    &:hover {
      color: #333;
    }
  }
}
</style>
