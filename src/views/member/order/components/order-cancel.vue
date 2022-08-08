<template>
  <XtxDialog title="取消订单" v-model:visible="visibleDialog">
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a
          @click="curText = item"
          v-for="item in cancelReason"
          :key="item"
          href="javascript:;"
          :class="{ active: curText === item }"
        >
          {{ item }}
        </a>
      </div>
    </div>
    <template #footer>
      <XtxButton
        type="gray"
        @click="visibleDialog = false"
        style="margin-right: 20px"
      >
        取消
      </XtxButton>
      <XtxButton type="primary" @click="confirm">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<script>
import { ref, inject } from 'vue'
import { cancelReason } from '@/api/constant'
import { cancelOrder } from '@/api/my'
import Message from '@/components/library/message'
export default {
  name: 'OrderCancel',
  setup (props) {
    // 对话框的显示和隐藏
    const visibleDialog = ref(false)
    // 取消原因
    const curText = ref('')
    // 取消的订单
    const curOrder = ref(null)

    // 打开对话框
    const open = (order) => {
      visibleDialog.value = true
      // 记录当前要取消的订单
      curOrder.value = order
      // 清除之前选中原因
      curText.value = ''
    }

    // 再次请求数据
    const getData = inject('getData')

    // 确认按钮--发请求
    const confirm = () => {
      // 判断是否有选择原因
      if (!curText.value) {
        return Message('请选择取消订单原因')
      }
      // 发请求
      cancelOrder({ id: curOrder.value.id, cancelReason: curText.value }).then(
        () => {
          // 修改当前订单状态: 待付款 => 已取消
          curOrder.value.orderStatus = 6
          // 提示成功
          Message('取消订单成功', 'success')
          // 关闭对话框
          visibleDialog.value = false
          // 刷新页面
          getData && getData()
        }
      )
    }

    return { visibleDialog, curText, cancelReason, open, confirm }
  }
}
</script>

<style scoped lang="less">
.xtx-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
