<template>
  <div class="member-order">
    <!-- 插槽内不能写注释!!!!! -->
    <XtxTabs v-model="activeName" @tab-change="tabChange">
      <xtx-tabs-panel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </xtx-tabs-panel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <OrderItem
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      ></OrderItem>
    </div>
    <!-- 分页 -->
    <XtxPagination></XtxPagination>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { orderStatus } from '@/api/constant.js'
import OrderItem from './components/order-item.vue'
import { getOrderList } from '@/api/my'
export default {
  name: 'MemberOrder',
  components: { OrderItem },
  setup (props) {
    // 默认选中 全部订单
    const activeName = ref('all')

    const tabChange = (tab) => {
      console.log(tab)
    }

    const orderList = ref([])
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      orderState: 0
    })
    getOrderList(reqParams).then((data) => {
      orderList.value = data.result.items
      console.log(orderList.value)
    })

    return { activeName, tabChange, orderStatus, orderList }
  }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background-color: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
}
</style>
