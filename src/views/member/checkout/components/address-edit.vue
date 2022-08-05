<template>
  <XtxDialog
    :title="`${form.id ? '修改' : '添加'}收货地址`"
    v-model:visible="dialogVisible"
  >
    <div class="address-edit">
      <Form
        class="xtx-form"
        :validation-schema="mySchema"
        v-slot="{ errors }"
        ref="FormCom"
      >
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <Field
              name="receiver"
              v-model="form.receiver"
              class="input"
              placeholder="请输入收货人"
            />
          </div>
          <div class="error" v-if="errors.receiver">
            <i class="iconfont icon-warning" />{{ errors.receiver }}
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <Field
              name="mobile"
              v-model="form.contact"
              class="input"
              placeholder="请输入手机号"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              :fullLocation="form.fullLocation"
              placeholder="请选择所在地区"
              @selectedAttr="xtxCityHandler"
            />
          </div>
          <div class="error" v-if="!form.fullLocation">
            <i class="iconfont icon-warning" />请选择收货地区
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <Field
              name="address"
              v-model="form.address"
              class="input"
              placeholder="请输入详细地址"
            />
          </div>
          <div class="error" v-if="errors.address">
            <i class="iconfont icon-warning" />{{ errors.address }}
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <Field
              name="postalCode"
              v-model="form.postalCode"
              class="input"
              placeholder="请输入邮政编码"
            />
          </div>
          <div class="error" v-if="errors.postalCode">
            <i class="iconfont icon-warning" />{{ errors.postalCode }}
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              v-model="form.addressTags"
              class="input"
              placeholder="请输入地址标签(以英文逗号分割)"
            />
          </div>
        </div>
      </Form>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right: 20px">取消</XtxButton>
      <XtxButton type="primary" @click="confirm">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { inject, reactive, ref } from 'vue'
import { addAddress, editAddress } from '@/api/checkout'
import Message from '@/components/library/message'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
export default {
  name: 'AddressEdit',
  components: { Form, Field },
  setup () {
    const dialogVisible = ref(false)
    // 打开函数
    const open = (address) => {
      if (address.id) {
        // 有id，编辑地址
        // 展示要修改的地址
        for (const key in address) {
          form[key] = address[key]
        }
      } else {
        // 无id，添加地址
        // 清空上一次数据
        for (const key in form) {
          form[key] = null
        }
        form.isDefault = 1
      }
      // 打开对话框
      dialogVisible.value = true
    }

    const updateOrderInfo = inject('getOrderInfo')

    // 收集表格数据
    const form = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 1,
      fullLocation: null
    })

    // 城市选择组件回调
    const xtxCityHandler = (data) => {
      form.provinceCode = data.provinceCode
      form.cityCode = data.cityCode
      form.countyCode = data.countryCode
      form.fullLocation = data.fullLocation
    }

    const FormCom = ref(null)
    // 接收校验规则
    const mySchema = {
      receiver: schema.receiver,
      mobile: schema.mobile,
      address: schema.address,
      postalCode: schema.postalCode
    }
    // 点击确认按钮
    const confirm = async () => {
      const result = await FormCom.value.validate()
      if (result && form.fullLocation) {
        // 验证通过

        if (form.id) {
          // 编辑地址
          editAddress(form)
            .then((data) => {
              // 提示成功
              Message('修改收货地址成功', 'success')
              // 更新数据
              updateOrderInfo()
            })
            .catch((e) => {
              if (e.response) {
                Message(e.response.data.message || '修改地址失败', 'error')
              }
            })
        } else {
          // 添加地址
          // 调用添加地址api
          addAddress(form)
            .then((data) => {
              // console.log(data.result);  // 这里返回新添加的地址id
              // 提示成功
              Message('添加收货地址成功', 'success')
              // 更新数据
              updateOrderInfo()
            })
            .catch((e) => {
              // 最多10个地址
              if (e.response) {
                Message(
                  e.response.data.message + '地址信息' || '添加地址失败',
                  'error'
                )
              }
            })
        }
        // 关闭对话框
        dialogVisible.value = false
      }
    }
    return {
      dialogVisible,
      open,
      form,
      xtxCityHandler,
      confirm,
      mySchema,
      FormCom
    }
  }
}
</script>
<style scoped lang="less">
.address-edit {
  .xtx-dialog {
    :deep(.wrapper) {
      width: 780px;
      .body {
        font-size: 14px;
      }
    }
  }
  .xtx-form {
    padding: 0;
    input {
      outline: none;
      &::placeholder {
        color: #ccc;
      }
    }
  }
  .xtx-city {
    width: 320px;
    :deep(.select) {
      height: 50px;
      line-height: 48px;
      display: flex;
      padding: 0 10px;
      justify-content: space-between;
      .placeholder {
        color: #ccc;
      }
      i {
        color: #ccc;
        font-size: 18px;
      }
      .value {
        font-size: 14px;
      }
    }
    :deep(.option) {
      top: 49px;
    }
  }
}
</style>
