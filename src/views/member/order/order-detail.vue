<template>
  <div class="order-detail" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order"></DetailAction>
    <!-- 步骤条-->
    <XtxSteps :active="order.orderState" v-if="status && !outOfTime">
      <XtxStepsItem title="提交订单" desc="2021-03-18 02:11:47" />
      <XtxStepsItem title="付款成功" desc="2021-03-18 02:15:03" />
      <XtxStepsItem title="商品发货" desc="2021-03-18 11:11:37" />
      <XtxStepsItem title="确认收货" />
      <XtxStepsItem title="订单完成" />
    </XtxSteps>
    <!-- 物流栏 -->
    <suspense v-if="[3, 4, 5].includes(order.orderState)">
      <!-- default:setup是异步的组件 -->
      <template #default>
        <DetailLogistics :order="order"></DetailLogistics>
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </suspense>
    <!-- 订单商品信息 -->
    <DetailInfo :order="order"></DetailInfo>
  </div>
</template>

<script>
import { provide, ref } from 'vue'
import { getOrderDetail } from '@/api/pay'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action.vue'
import DetailLogistics from './components/detail-logistic.vue'
import DetailInfo from './components/detail-info.vue'
export default {
  name: 'OrderDetail',
  components: { DetailAction, DetailLogistics, DetailInfo },
  setup (props) {
    const route = useRoute()

    const status = ref(null)
    const outOfTime = ref(null)

    const order = ref(null)

    getOrderDetail(route.params.id).then((data) => {
      order.value = data.result
      // 是否显示steps组件
      // 1待付款(未超时) 2待发货 3待收货 4待评价 5已完成
      status.value = [1, 2, 3, 4, 5].includes(order.value.orderState)
      if (order.value.orderState === 1) {
        if (order.value.countdown !== -1) {
          // 未超时
          outOfTime.value = false
        } else {
          outOfTime.value = true
        }
      }
    })

    provide('getOrderDetail', getOrderDetail)

    return { order, status, outOfTime }
  }
}
</script>

<style scoped lang="less">
.order-detail {
  background: #fff;
  height: 100%;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
