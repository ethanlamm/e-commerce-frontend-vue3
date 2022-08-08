<template>
  <div class="detail-action" v-if="order && order.id">
    <div class="state">
      <span class="iconfont icon-order-unpay"></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 1待付款 -->
      <!-- 未超时 -->
      <template v-if="order.orderState === 1 && order.countdown > 0">
        <XtxButton
          @click="$router.push('/member/pay?id=' + order.id)"
          type="primary"
          size="small"
        >
          立即付款
        </XtxButton>
        <XtxButton type="gray" size="small" @click="cancelHandler(order)"
          >取消订单</XtxButton
        >
      </template>
      <!-- 已超时 -->
      <template v-if="order.orderState === 1 && order.countdown === -1">
        <div class="outOfTime">订单已超时</div>
      </template>
      <!-- 2待发货 -->
      <template v-if="order.orderState === 2">
        <XtxButton type="primary" size="small">再次购买</XtxButton>
      </template>
      <!-- 3待收货 -->
      <template v-if="order.orderState === 3">
        <XtxButton type="primary" size="small">确认收货</XtxButton>
        <XtxButton type="plain" size="small">再次购买</XtxButton>
      </template>
      <!-- 4待评价 -->
      <template v-if="order.orderState === 4">
        <XtxButton type="primary" size="small">再次购买</XtxButton>
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 5已完成 -->
      <template v-if="order.orderState === 5">
        <XtxButton type="primary" size="small">再次购买</XtxButton>
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 6已取消：无 -->
    </div>
  </div>
  <teleport to="#dialog">
    <OrderCancel ref="OrderCancelCom"></OrderCancel>
  </teleport>
</template>
<script>
import { orderStatus } from '@/api/constant'
import OrderCancel from './order-cancel.vue'
import { cancelFn } from '../index.vue'
export default {
  name: 'DetailAction',
  components: { OrderCancel },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    return { orderStatus, ...cancelFn() }
  }
}
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
    .outOfTime {
      color: @priceColor;
      font-weight: 700;
    }
  }
}
</style>
