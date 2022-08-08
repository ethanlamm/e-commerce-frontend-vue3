<template>
  <div class="order-detail" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order"></DetailAction>
    <!-- 步骤条-->
    <XtxSteps :active="order.orderState === 6 ? 1 : order.orderState">
      <XtxStepsItem title="提交订单" desc="2021-03-18 02:11:47" />
      <XtxStepsItem title="付款成功" desc="2021-03-18 02:11:47" />
      <XtxStepsItem title="商品发货" desc="2021-03-18 02:11:47" />
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
  </div>
</template>

<script>
import { ref } from 'vue'
import { getOrderDetail } from '@/api/pay'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action.vue'
import DetailLogistics from './components/detail-logistic.vue'
export default {
  name: 'OrderDetail',
  components: { DetailAction, DetailLogistics },
  setup (props) {
    const route = useRoute()
    const order = ref(null)

    getOrderDetail(route.params.id).then((data) => {
      order.value = data.result
    })

    return { order }
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
