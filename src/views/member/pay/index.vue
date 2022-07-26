<template>
  <div class="xtx-pay-page">
    <div class="container" v-if="orderInfo">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>支付订单</XtxBreadItem>
      </XtxBread>
      <div v-if="orderInfo.countdown > -1">
        <!-- 付款信息 -->
        <div class="pay-info">
          <span class="icon iconfont icon-queren2"></span>
          <div class="tip">
            <p>订单提交成功！请尽快完成支付。</p>
            <p>
              支付还剩
              <span class="timeText">{{ timeText }}</span>
              , 超时后将取消订单
            </p>
          </div>
          <div class="amount">
            <span>应付总额：</span>
            <span>¥ {{ orderInfo.payMoney.toFixed(2) }}</span>
          </div>
        </div>
        <!-- 付款方式 -->
        <div class="pay-type">
          <p class="head">选择以下支付方式付款</p>
          <div class="item">
            <p>支付平台</p>
            <a class="btn wx" href="javascript:;"></a>
            <a
              class="btn alipay"
              @click="visibleDialog = true"
              :href="payUrl"
              target="_blank"
            ></a>
          </div>
          <div class="item">
            <p>支付方式</p>
            <a class="btn" href="javascript:;">招商银行</a>
            <a class="btn" href="javascript:;">工商银行</a>
            <a class="btn" href="javascript:;">建设银行</a>
            <a class="btn" href="javascript:;">农业银行</a>
            <a class="btn" href="javascript:;">交通银行</a>
          </div>
        </div>
      </div>
      <!-- 订单超时 -->
      <div class="timeOut" v-else>
        <div class="timeBox">
          <p>你的订单已超时，未支付成功</p>
          <div class="goHome">
            <router-link to="/" replace>返回首页</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- loading图 -->
    <div class="container" v-else>
      <div class="imgContainer">
        <div><img src="../../../assets/images/loading.gif" /></div>
      </div>
    </div>
    <!-- 支付弹窗 -->
    <XtxDialog title="正在支付..." v-model:visible="visibleDialog">
      <div class="pay-wait">
        <img src="@/assets/images/load.gif" alt="" />
        <div v-if="orderInfo">
          <p>如果支付成功：</p>
          <RouterLink :to="`/member/order/${$route.query.orderId}`">
            查看订单详情>
          </RouterLink>
          <p>如果支付失败：</p>
          <RouterLink to="/">查看相关疑问></RouterLink>
        </div>
      </div>
    </XtxDialog>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderDetail } from '@/api/pay'
import { usePayTime } from '@/hooks'
import { baseURL } from '@/utils/request'
export default {
  name: 'PayVue',
  setup (props) {
    const route = useRoute()
    const orderInfo = ref(null)

    const { start, timeText } = usePayTime()

    getOrderDetail(route.query.orderId).then((data) => {
      orderInfo.value = data.result
      // countdown 倒计时时间
      if (data.result.countdown > -1) {
        start(data.result.countdown)
      }
    })

    // 支付宝跳转地址 后台服务基准地址 + 支付页面地址 + 订单ID + 回跳地址
    const redirect = encodeURIComponent(
      'http://www.corho.com:8080/#/pay/callback'
    )
    const payUrl = `${baseURL}pay/aliPay?orderId=${route.query.orderId}&redirect=${redirect}`

    // 支付提示
    const visibleDialog = ref(false)

    return { orderInfo, timeText, payUrl, visibleDialog }
  }
}
</script>
<style scoped lang="less">
.pay-wait {
  display: flex;
  justify-content: space-around;
  p {
    margin-top: 30px;
    font-size: 14px;
  }
  a {
    color: @xtxColor;
  }
}
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
  .timeOut {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 200px;
    background-color: white;
    .timeBox {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .goHome {
        font-size: 18px;
        font-weight: 500;
      }
      p {
        color: @priceColor;
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 10px;
      }
    }
  }
}
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .tip {
    padding-left: 10px;
    flex: 1;
    .timeText {
      color: @priceColor;
      font-weight: 700;
    }
    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: @priceColor;
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;
    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: @xtxColor;
    }
    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
        no-repeat center / contain;
    }
    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
        no-repeat center / contain;
    }
  }
}
</style>
