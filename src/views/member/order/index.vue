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
        @on-cancel="cancelHandler"
        @on-delete="deleteHandler"
      ></OrderItem>
      <!-- 数据加载中 -->
      <div v-if="loading" class="loading"></div>
      <!-- 暂无数据 -->
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
    </div>
    <!-- 分页 -->
    <XtxPagination
      v-if="totalData"
      :pageSize="reqParams.pageSize"
      :currPage="reqParams.page"
      :totalData="totalData"
      @pageChange="reqParams.page = $event"
    ></XtxPagination>
    <!-- 取消订单原因组件 -->
    <OrderCancel ref="OrderCancelCom"></OrderCancel>
  </div>
</template>

<script>
import { reactive, ref, watch, provide } from 'vue'
import { orderStatus } from '@/api/constant.js'
import OrderItem from './components/order-item.vue'
import { getOrderList, delteOrder } from '@/api/my'
import OrderCancel from './components/order-cancel.vue'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/message'
export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel },
  setup (props) {
    // 默认选中 全部订单
    const activeName = ref('all')

    // 数据加载中
    const loading = ref(false)
    const orderList = ref([])
    // 总数据条数
    const totalData = ref(0)
    // 请求参数(筛选条件)
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })

    // 发请求
    const getData = () => {
      // 开始请求数据
      loading.value = true
      getOrderList(reqParams).then((data) => {
        orderList.value = data.result.items
        totalData.value = data.result.counts
        // 请求完毕
        loading.value = false
      })
    }
    // 侦听 reactive 数据有bug
    watch(
      reqParams,
      () => {
        getData()
      },
      { immediate: true }
    )

    // 订单状态修改后，刷新页面--即再次请求数据
    const reload = () => {
      // 再次请求数据
      // reqParams.page = 1
      // reqParams.orderState = 0
      // 请求当前页，page和orderState不用修改
      getData()
    }
    // provide出去
    provide('reload', reload)

    // tab切换
    const tabChange = ({ index }) => {
      // index 刚好和 reqParams.orderState 相对应
      reqParams.orderState = index
      // 页码重置为第一页
      reqParams.page = 1
    }

    // 删除订单
    const deleteHandler = (order) => {
      // 弹窗
      Confirm('确认删除该订单吗？')
        .then(() => {
          delteOrder([order.id]).then(() => {
            Message('删除订单成功', 'success')
            // 再次请求数据
            getData()
          })
        })
        .catch(() => Message('您已取消删除订单'))
    }

    return {
      activeName,
      tabChange,
      orderStatus,
      orderList,
      loading,
      reqParams,
      totalData,
      reload,
      ...cancelFn(),
      deleteHandler
    }
  }
}
// 取消订单逻辑
const cancelFn = () => {
  // 父组件获取子组件实例
  const OrderCancelCom = ref(null)

  const cancelHandler = (order) => {
    // 打开对话框
    OrderCancelCom.value.open(order)
  }

  return { cancelHandler, OrderCancelCom }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background-color: #fff;
}
.order-list {
  min-height: 400px;
  background: #fff;
  padding: 20px;
  position: relative;
  .loading {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
      no-repeat center;
  }
  .none {
    height: 400px;
    text-align: center;
    line-height: 400px;
    color: #999;
  }
}
</style>
