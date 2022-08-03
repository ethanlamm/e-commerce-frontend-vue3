<template>
  <Form
    class="xtx-form"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    ref="FormCom"
  >
    <div class="user-info">
      <img :src="avatar" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.mobile }"
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="绑定的手机号"
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
          v-model="form.code"
          name="code"
          class="input"
          type="text"
          placeholder="短信验证码"
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
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 1.数据准备：unionId，avatar，nickname
    // 2.验证收集表单数据 mobile code unionId
    // 3.验证码(发请求)、倒计时
    // 4.整理数据发请求
    // 5.请求成功，存储返回的用户信息，跳转，成功提示
    // 6.请求失败，失败提示

    // 获取nickname、avatar
    const nickname = ref(null)
    const avatar = ref(null)
    // 确保已登录
    if (QC.Login.check()) {
      QC.api('get_user_info').success(({ data }) => {
        nickname.value = data.nickname
        avatar.value = data.figureurl_1
      })
    }

    // 校验规则
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }
    // 收集数据
    const form = reactive({
      mobile: null,
      code: null
    })

    const FormCom = ref(null) // Form 组件
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
      const vaild = mySchema.mobile(form.mobile) // 验证通过 true | 验证不通过 字符串(错误提示)
      if (vaild === true) {
        // 验证通过
        // 但倒计时为0时，才发请求
        if (time.value === 0) {
          try {
            // 发请求，验证码
            await userQQBindCode(form.mobile) // 无返回值，默认123456
            // 验证码请求成功，开启倒计时
            time.value = 60
            resume()
            Message('发送成功', 'success')
          } catch (error) {
            if (error.response) {
              Message(error.response.data.message, 'error')
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

    const store = useStore()
    const router = useRouter()
    // 立即绑定
    const submit = async () => {
      const result = await FormCom.value.validate()
      if (result) {
        userQQBindLogin({
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
            Message('QQ绑定成功', 'success')
          })
          .catch((e) => {
            if (e.response) {
              Message(e.response.data.message, 'error')
            }
          })
      }
    }
    return {
      nickname,
      avatar,
      mySchema,
      form,
      FormCom,
      time,
      sendCode,
      submit
    }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
