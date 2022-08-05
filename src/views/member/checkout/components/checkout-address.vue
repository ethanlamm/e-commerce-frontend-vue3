<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-else>
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span>
          {{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span>
          {{ showAddress.fullLocation }}{{ showAddress.address }}
        </li>
      </ul>
      <a href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog">切换地址</XtxButton>
      <XtxButton class="btn" @click="openEditDialog">添加地址</XtxButton>
    </div>
  </div>
  <!-- 切换地址对话框 -->
  <XtxDialog title="切换收货地址" v-model:visible="dialogVisible">
    <div
      class="text item"
      v-for="item in list"
      :key="item.id"
      @click="tempAddress = item"
      :class="{ active: tempAddress && tempAddress.id === item.id }"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li>
          <span>联系方式：</span>
          {{ item.contact.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span>
          {{ item.fullLocation.replace(/ /g, "") + item.address }}
        </li>
      </ul>
    </div>
    <template #footer>
      <XtxButton
        type="gray"
        style="margin-right: 20px"
        @click="dialogVisible = false"
      >
        取消
      </XtxButton>
      <XtxButton type="primary" @click="confirmAddress">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加编辑地址对话框 -->
  <AddressEdit ref="editTarget"></AddressEdit>
</template>
<script>
import { computed, ref, watch } from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  name: 'CheckoutAddress',
  components: { AddressEdit },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    // 对话框的显示隐藏
    const dialogVisible = ref(false)

    // 展示地址
    // 1.list无数据，展示提示信息
    // 2.list有数据：
    // 2.1从list中找到默认地址，展示，默认地址
    // 2.2list中无默认地址，则展示第一条
    const showAddress = ref(null)
    const addresslist = computed(() => props.list)

    // 这是添加地址后，addresslist改变，再次渲染选中的地址信息(showAddress)
    watch(
      () => addresslist.value,
      (newValue) => {
        if (newValue && newValue.length) {
          const findResult = newValue.find((item) => item.isDefault === 0)
          if (findResult) {
            // 找到了默认地址
            showAddress.value = findResult
          } else {
            // 没有默认地址 ==> 第一条
            showAddress.value = newValue[0]
          }
        }
      },
      { immediate: true }
    )

    // 这是切换地址，传出地址id
    watch(
      () => showAddress.value,
      (newValue) => {
        if (newValue) {
          emit('selectedAddress', newValue.id)
        }
      },
      { immediate: true }
    )

    const tempAddress = ref(null)

    // 打开对话框--切换地址
    const openDialog = () => {
      // 1.清空上次选择的地址
      tempAddress.value = null
      // 2.打开对话框
      dialogVisible.value = true
    }

    // 点击确认按钮
    const confirmAddress = () => {
      // 1.将选择的地址赋值给showAddress进行显示
      showAddress.value = tempAddress.value
      // 2.通知父组件，选择地址的id--watch侦听
      // 3.关闭对话框
      dialogVisible.value = false
    }

    // 拿到编辑地址对话框实例
    const editTarget = ref(null)
    // 打开编辑地址对话框
    const openEditDialog = () => {
      editTarget.value.open()
    }

    return {
      showAddress,
      dialogVisible,
      tempAddress,
      confirmAddress,
      openDialog,
      editTarget,
      openEditDialog
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
