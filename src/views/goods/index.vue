<template>
  <div class="xtx-goods-page">
    <div class="container" v-if="goods">
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
          <XtxButton type="primary" class="button" @click="addCart"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :id="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs></GoodsTabs>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn></GoodsWarn>
          </div>
        </div>
        <!-- 24热榜+周榜 -->
        <div class="goods-aside">
          <GoodsHot :type="1"></GoodsHot>
          <GoodsHot :type="2"></GoodsHot>
        </div>
      </div>
    </div>
    <!-- loading图 -->
    <div class="container" v-else>
      <div class="imgContainer">
        <div><img src="../../assets/images/loading.gif" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, provide, ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getGoods } from '@/api/goods'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import Message from '@/components/library/message'
import { useStore } from 'vuex'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup (props) {
    let goods = ref(null)
    goods = getData()

    // 祖先组件提供数据供后代组件使用
    provide('goods', goods)

    const SKUINFO = reactive({})
    // 接收sku组件选择后的sku信息
    const getSkuInfo = (skuInfo) => {
      // 根据已选择的sku，修改信息
      // 有skuId，才修改
      // 这是规格组件选择完整后，修改展示商品信息的操作
      if (skuInfo.skuId) {
        goods.value.price = skuInfo.price
        goods.value.oldPrice = skuInfo.oldPrice
        goods.value.inventory = skuInfo.inventory
      }
      // 接收传过来的sku信息，可能为完整信息，也可能为空对象
      SKUINFO.value = skuInfo
      // console.log(SKUINFO.value);
    }

    // 商品数量
    const num = ref(1)
    const store = useStore()

    // 加入购物车
    // 由于有登录和未登录状态：
    // 已登录只需要传skuId、conut，然后请求接口，返回数据
    // 未登录，则需要根据已登录返回的数据结构，先准备好数据，然后再dispatch给vuex，在vuex中将数据存储在本地
    // 需要准备数据 {id,skuId,name,attrsText,picture,price,nowPrice,selected,stock,count,isEffective}
    const addCart = () => {
      // 已选择完整商品信息
      if (SKUINFO.value && SKUINFO.value.skuId) {
        // 解构整理参数
        const { id, name, mainPictures } = goods.value
        const {
          skuId,
          specsText: attrsText,
          price,
          inventory: stock
        } = SKUINFO.value
        // dispatch
        store
          .dispatch('cart/addCart', {
            id,
            skuId,
            name,
            attrsText,
            picture: mainPictures[0],
            price,
            nowPrice: price,
            selected: true,
            stock,
            count: num.value,
            isEffective: true
          })
          .then(() => Message('加入购物车成功', 'success'))
          .catch((e) => {})
      } else {
        Message('请选择完整规格')
      }
    }
    return { goods, getSkuInfo, num, addCart }
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
            // console.log(temp.value);
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
.container {
  .imgContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 600px;
    margin-top: 20px;
    background-color: white;
  }
}
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
