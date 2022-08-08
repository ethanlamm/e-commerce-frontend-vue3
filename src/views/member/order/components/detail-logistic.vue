<template>
  <div class="detail-logistics">
    <p>
      <span>{{ list[0].time }}</span>
      <span>{{ list[0].text }}</span>
    </p>
    <a href="javascript:;" @click="logisticHandler(order)">查看物流</a>
  </div>
  <!-- 查看物流对话框 -->
  <!-- teleport:传送，适用于较深层次的弹窗组件 -->
  <!-- 在index.html中声明一个id为logistic的容器，teleport组件包裹的内容将传送到该容器中显示 -->
  <teleport to="#dialog">
    <OrderLogistic ref="OrderLogisticCom"></OrderLogistic>
  </teleport>
</template>
<script>
import { logisticsOrder } from '@/api/my'
import OrderLogistic from './order-logistic.vue'
import { logisticFn } from '../index.vue'
import { ref } from 'vue'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistic },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  async setup (props) {
    const list = ref([])
    const { result } = await logisticsOrder(props.order.id)
    list.value = result.list

    return { list, ...logisticFn() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
