<template>
  <div class="xtx-pay-checkout-page">
    <div class="container" v-if="order">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>填写订单</XtxBreadItem>
      </XtxBread>
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <!-- 收货地址组件 -->
          <CheckoutAddress
            :list="order.userAddresses"
            @selectedAddress="selectedAddressHandler"
          ></CheckoutAddress>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.goods" :key="item.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="item.picture" />
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen; {{ item.price }}</td>
                <td>{{ item.count }}</td>
                <td>&yen; {{ item.totalPrice }}</td>
                <td>&yen; {{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;"
            >不限送货时间：周一至周日</a
          >
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color: #999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ order.summary.goodsCount }} 件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥ {{ order.summary.totalPrice }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥ {{ order.summary.postFee }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">¥ {{ order.summary.totalPayPrice }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XtxButton type="primary" @click="submit">提交订单</XtxButton>
        </div>
      </div>
    </div>
    <!-- loading图 -->
    <div class="container" v-else>
      <div class="imgContainer">
        <div><img src="../../../assets/images/loading.gif" /></div>
      </div>
    </div>
  </div>
</template>
<script>
import { provide, reactive, ref } from 'vue'
import CheckoutAddress from './components/checkout-address.vue'
import { createOrder, submitOrder, repurchaseOrder } from '@/api/checkout'
import Message from '@/components/library/message'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CheckoutVue',
  components: { CheckoutAddress },
  setup (props) {
    const order = ref(null)
    const route = useRoute()
    // 获取订单数据函数
    const getOrderInfo = () => {
      createOrder()
        .then((data) => {
          order.value = data.result
          reqParams.goods = data.result.goods.map(({ skuId, count }) => {
            return { skuId, count }
          })
        })
        .catch((e) => {
          if (e.response) {
            Message(e.response.data.message || '生成订单失败')
          }
        })
    }

    // 两种情况
    if (route.query.orderId) {
      repurchaseOrder(route.query.orderId)
        .then((data) => {
          order.value = data.result
          reqParams.goods = data.result.goods.map(({ skuId, count }) => {
            return { skuId, count }
          })
        })
        .catch((e) => {
          if (e.response) {
            Message(e.response.data.message || '生成订单失败')
          }
        })
    } else {
      getOrderInfo()
    }

    provide('getOrderInfo', getOrderInfo)

    // 请求参数
    const reqParams = reactive({
      deliveryTimeType: 1, // 配送时间类型，1为不限，2为工作日，3为双休或假日
      payType: 1, // 支付方式，1为在线支付，2为货到付款
      payChannel: 1, // 支付渠道：支付渠道，1支付宝、2微信
      buyerMessage: '', // 买家留言
      // 以上4个为默认
      goods: [],
      addressId: null
    })

    // 地址选择，接收子组件的地址id
    const selectedAddressHandler = (id) => {
      reqParams.addressId = id
    }

    const router = useRouter()
    // 提交订单按钮
    const submit = () => {
      // 判断是否选择了地址
      if (!reqParams.addressId) return Message('请先选择收货地址，再提交订单')
      // 发请求
      submitOrder(reqParams).then((data) => {
        // 1.提示成功
        Message('提交订单成功', 'success')
        // 2.跳转至 支付页(replace--不能回跳至 /member/checkout )
        router.replace(`/member/pay?orderId=${data.result.id}`)
      })
    }

    return { order, selectedAddressHandler, submit }
  }
}
</script>
<style scoped lang="less">
.xtx-pay-checkout-page {
  // loading图
  .imgContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 600px;
    margin-top: 20px;
    background-color: white;
  }
  // -------
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,
  &:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
