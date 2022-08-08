<template>
  <div class="order-detail" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order"></DetailAction>
    <!-- 步骤条 组件xtx-steps.vue-->
    <!-- 物流栏 -->
    <!-- 订单商品信息 -->
  </div>
</template>

<script>
import { ref } from 'vue'
import { getOrderDetail } from '@/api/pay'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action.vue'
export default {
  name: 'OrderDetail',
  components: { DetailAction },
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
</style>
