<template>
  <div class="home-product" ref="target">
    <!-- 面板组件 -->
    <HomePanel :title="Item.name" v-for="Item in goodsList" :key="Item.id">
      <!-- 头部右侧插槽 -->
      <template v-slot:right>
        <div class="sub">
          <template v-for="item in Item.children" :key="item.id">
            <RouterLink :to="`/category/sub/${item.id}`">{{
              item.name
            }}</RouterLink>
          </template>
        </div>
        <XtxMore :path="`/category/${Item.id}`" />
      </template>
      <!-- 面板内容 -->
      <div class="box">
        <!-- 左侧大图 -->
        <RouterLink class="cover" :to="`/category/${Item.id}`">
          <img v-lazy="Item.picture" />
          <strong class="label">
            <span>{{ Item.name }}馆</span>
            <span>{{ Item.saleInfo }}</span>
          </strong>
        </RouterLink>
        <!-- 右侧小图 -->
        <ul class="goods-list">
          <li v-for="goods in Item.goods" :key="goods.id">
            <HomeGoods :goods="goods" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './commons/home-panel.vue'
import HomeGoods from './commons/home-goods.vue'
import { getGoods } from '@/api/home'
import { ref } from 'vue'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeProduct',
  components: { HomePanel, HomeGoods },
  setup () {
    const target = ref(null)
    const goodsList = useLazyData(target, getGoods)

    return { target, goodsList }
  }
}
</script>

<style scoped lang='less'>
.home-product {
  background: #fff;
  height: 2900px;
  .sub {
    margin-bottom: 2px;
    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;
      &:hover {
        background: @xtxColor;
        color: #fff;
      }
      &:last-child {
        margin-right: 80px;
      }
    }
  }
  .box {
    display: flex;
    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        span {
          text-align: center;
          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }
          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }
    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
