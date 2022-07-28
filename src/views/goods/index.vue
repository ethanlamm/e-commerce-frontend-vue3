<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">
          {{ goods.categories[1].name }}
        </XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">
          {{ goods.categories[0].name }}
        </XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <!-- 图片区 -->
          <GoodsImage :images="goods.mainPictures"></GoodsImage>
          <!-- 销售属性区 -->
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <!-- 名称信息 -->
          <GoodsName :goods="goods"></GoodsName>
          <!-- 规格选择 -->
          <GoodsSku :goods="goods" @sendSkuInfo="getSkuInfo"></GoodsSku>
          <!-- 数量选择 -->
          <XtxNumbox label="数量" v-model="num"></XtxNumbox>
          <!-- 按钮 -->
          <XtxButton type="primary" class="button">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :id="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getGoods } from '@/api/goods'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku },
  setup (props) {
    let goods = ref(null)
    goods = getData()
    // 接收sku组件选择后的sku信息
    const getSkuInfo = (skuInfo) => {
      // 根据已选择的sku，修改信息
      // 有skuId，才修改
      if (skuInfo.skuId) {
        goods.value.price = skuInfo.price
        goods.value.oldPrice = skuInfo.oldPrice
        goods.value.inventory = skuInfo.inventory
      }
    }
    const num = ref(1)
    return { goods, getSkuInfo, num }
  }
}
// 获取数据
const getData = () => {
  const temp = ref(null)
  const route = useRoute()
  watch(
    () => route.params.id,
    (newValue) => {
      if (newValue && route.path === `/product/${newValue}`) {
        getGoods(newValue).then((data) => {
          temp.value = null
          nextTick(() => {
            temp.value = data.result
            console.log(temp.value)
          })
        })
      }
    },
    { immediate: true }
  )

  return temp
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;

    .button {
      margin-top: 20px;
    }
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
