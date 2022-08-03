<template>
  <div class="xtx-cart-page">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <!-- 商品列表 -->
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox
                  :modelValue="$store.getters['cart/isSelectedAll']"
                  @change="checkAll"
                >
                  全选
                </XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="$store.getters['cart/validList'].length == 0">
              <td colspan="6"><CartNone></CartNone></td>
            </tr>
            <tr
              v-else
              v-for="goods in $store.getters['cart/validList']"
              :key="goods.skuId"
            >
              <td>
                <XtxCheckbox
                  :modelValue="goods.selected"
                  @change="($event) => checkOne(goods, $event)"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`">
                    <img :src="goods.picture" />
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{ goods.name }}</p>
                    <!-- 选择规格组件 -->
                    <CartSku
                      :attrsText="goods.attrsText"
                      :skuId="goods.skuId"
                      @change="($event) => changeHandler(goods.skuId, $event)"
                    ></CartSku>
                  </div>
                </div>
              </td>
              <!-- 单价 -->
              <td class="tc">
                <p>&yen; {{ priceFormat(goods.nowPrice) }}</p>
                <p v-if="goods.nowPrice - goods.price > 0">
                  比加入时降价
                  <span class="red">
                    &yen; {{ priceFormat(goods.nowPrice - goods.price) }}
                  </span>
                </p>
              </td>
              <!-- 数量 -->
              <td class="tc">
                <XtxNumbox
                  :modelValue="goods.count"
                  @change="($event) => changeCount(goods.skuId, $event)"
                />
              </td>
              <!-- 小计 -->
              <td class="tc">
                <p class="f16 red">
                  &yen;
                  {{ priceFormat((goods.nowPrice * 100 * goods.count) / 100) }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p>
                  <a
                    class="green"
                    href="javascript:;"
                    @click="deleteOne(goods.skuId)"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr
              v-for="item in $store.getters['cart/invalidList']"
              :key="item.skuId"
            >
              <td><XtxCheckbox style="color: #eee" /></td>
              <td>
                <div class="goods">
                  <RouterLink to="/"><img :src="item.picture" /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen; {{ priceFormat(item.nowPrice) }}</p>
              </td>
              <td class="tc">{{ item.count }}</td>
              <td class="tc">
                <p>
                  &yen;
                  {{ priceFormat((item.nowPrice * 100 * item.count) / 100) }}
                </p>
              </td>
              <td class="tc">
                <p>
                  <a
                    class="green"
                    href="javascript:;"
                    @click="deleteOne(item.skuId)"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox
            :modelValue="$store.getters['cart/isSelectedAll']"
            @change="checkAll"
          >
            全选
          </XtxCheckbox>
          <a href="javascript:;" @click="batchDelete(false)">删除已选商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDelete(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters["cart/validCount"] }} 件商品，已选择
          {{ $store.getters["cart/selectedCount"] }} 件，商品合计：
          <span class="red">¥ {{ $store.getters["cart/selectedAmount"] }}</span>
          <XtxButton type="primary">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import CartNone from './components/cart-none.vue'
import { useStore } from 'vuex'
import Confirm from '@/components/library/Confirm'
import CartSku from './components/cart-sku.vue'
export default {
  name: 'XtxCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup (props) {
    const store = useStore()
    // 价格格式化(2位小数) 过滤器 即 函数
    const priceFormat = (value) => {
      // toFixed:需要先转换成数字类型
      return parseFloat(value).toFixed(2)
    }

    // 点击每个商品前的复选框
    const checkOne = (goods, selected) => {
      // $event 先接收(占位)，后再传给当前函数，selected即为子组件传出的值，为要改变的值
      // console.log(selected);
      store.dispatch('cart/updateGoodsStatus', {
        skuId: goods.skuId,
        selected
      })
    }

    // 点击全选
    const checkAll = (selected) => {
      store.dispatch('cart/checkAll', selected)
    }

    // 点击每个商品后的删除操作
    const deleteOne = (skuId) => {
      Confirm('删除该商品？')
        .then(() => {
          store.dispatch('cart/deleteGoods', skuId)
        })
        .catch(() => {})
    }

    // 批量删除  已选商品 | 清空失效商品
    const batchDelete = (clearInvalid) => {
      Confirm(`确定${clearInvalid ? '清空失效' : '删除选中'}的商品？`)
        .then(() => {
          store.dispatch('cart/batchDelete', clearInvalid)
        })
        .catch(() => {})
    }

    // 商品数量修改
    const changeCount = (skuId, count) => {
      store.dispatch('cart/updateGoodsStatus', { skuId, count })
    }

    // 商品规格修改
    const changeHandler = (oldSkuId, skuInfo) => {
      store.dispatch('cart/changeGoods', { oldSkuId, skuInfo })
    }

    return {
      priceFormat,
      checkOne,
      checkAll,
      deleteOne,
      batchDelete,
      changeCount,
      changeHandler
    }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
