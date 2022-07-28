<template>
  <div class="goods-tabs">
    <nav>
      <a
        :class="{ active: activeName === 'GoodsDetail' }"
        @click="activeName = 'GoodsDetail'"
        href="javascript:;"
        >商品详情</a
      >
      <a
        :class="{ active: activeName === 'GoodsComment' }"
        @click="activeName = 'GoodsComment'"
        href="javascript:;"
        >商品评价<span>(500+)</span></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <!-- 动态组件 -->
    <!-- is的值是一个字符串，它既可以是 HTML 标签名称也可以是组件名称。 -->
    <component :is="activeName"></component>
  </div>
</template>

<script>
import { ref } from 'vue'
import GoodsDetail from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
export default {
  name: 'GoodsTabs',
  components: { GoodsDetail, GoodsComment },
  setup (props) {
    const activeName = ref('GoodsDetail')

    return { activeName }
  }
}
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
