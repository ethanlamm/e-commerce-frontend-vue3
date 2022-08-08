<template>
  <div class="order-item">
    <div class="head">
      <span>下单时间：{{ order.createTime }}</span>
      <span>订单编号：{{ order.id }}</span>
      <!-- orderState订单状态：1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消 -->
      <!-- 1待付款，显示倒计时 -->
      <span
        class="down-time"
        v-if="order.orderState === 1 && order.countdown > 0"
      >
        <i class="iconfont icon-down-time"></i>
        <b>
          付款截止：
          <span>{{ timeText }}</span>
        </b>
      </span>
      <!-- 5为已完成、6为已取消，显示删除按钮 -->
      <a
        v-if="[5, 6].includes(order.orederState) || order.countdown === -1"
        href="javascript:;"
        class="del"
        @click="$emit('on-delete', order)"
      >
        删除订单
      </a>
    </div>
    <div class="body">
      <div class="column goods">
        <ul>
          <li v-for="goods in order.skus" :key="goods.id">
            <a class="image" href="javascript:;">
              <img :src="goods.image" />
            </a>
            <div class="info">
              <p class="name ellipsis-2">{{ goods.name }}</p>
              <p class="attr ellipsis">{{ goods.attrsText }}</p>
            </div>
            <div class="price">¥ {{ goods.realPay }}</div>
            <div class="count">x {{ goods.quantity }}</div>
          </li>
        </ul>
      </div>
      <div class="column state">
        <p>{{ orderStatus[order.orderState].label }}</p>
        <!-- 1待付款，但已超时 => 订单已超时 -->
        <!-- 3待收货 => 查看物流 -->
        <!-- 4待评价 => 评价商品 -->
        <!-- 5已完成 => 查看评价 -->
        <p
          v-if="order.orderState === 1 && order.countdown == -1"
          class="outOfTime"
        >
          订单已超时
        </p>
        <p v-if="order.orderState === 3">
          <a href="javascript:;" class="green">查看物流</a>
        </p>
        <p v-if="order.orderState === 4">
          <a href="javascript:;" class="green">评价商品</a>
        </p>
        <p v-if="order.orderState === 5">
          <a href="javascript:;" class="green">查看评价</a>
        </p>
      </div>
      <div class="column amount">
        <p class="red">¥ {{ order.payMoney }}</p>
        <p>（含运费：¥ {{ order.postFee }})</p>
        <p>在线支付</p>
      </div>
      <div class="column action">
        <!-- 1待支付：立即付款，查看详情，取消订单 -->
        <!-- 2待发货：查看详情，再次购买 -->
        <!-- 3待收货：确认收货，查看详情，再次购买 -->
        <!-- 4待评价：查看详情，再次购买，申请售后 -->
        <!-- 5已完成：查看详情，再次购买，申请售后 -->
        <!-- 6已取消：查看详情 -->
        <XtxButton
          v-if="order.orderState === 1 && order.countdown > 0"
          type="primary"
          size="small"
          @click="$router.push(`/member/pay?orderId=${order.id}`)"
        >
          立即付款
        </XtxButton>
        <XtxButton v-if="order.orderState === 3" type="primary" size="small">
          确认收货
        </XtxButton>
        <p>
          <a
            @click="$router.push(`/member/order/${order.id}`)"
            href="javascript:;"
          >
            查看详情
          </a>
        </p>
        <p v-if="order.orderState === 1 && order.countdown > 0">
          <a href="javascript:;" @click="$emit('on-cancel', order)">取消订单</a>
        </p>
        <p v-if="[2, 3, 4, 5].includes(order.orderState)">
          <a href="javascript:;">再次购买</a>
        </p>
        <p v-if="[4, 5].includes(order.orderState)">
          <a href="javascript:;">申请售后</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { orderStatus } from '@/api/constant'
import { usePayTime } from '@/hooks'
export default {
  name: 'OrderItem',
  props: {
    order: {
      tyep: Object,
      default: () => {}
    }
  },
  emits: ['on-cancel', 'on-delete'],
  setup (props) {
    const { start, timeText } = usePayTime()
    if (props.order.countdown > -1) {
      start(props.order.countdown)
    }

    return { timeText, orderStatus }
  }
}
</script>

<style lang="less" scoped>
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
          span {
            font-weight: 600;
            color: @priceColor;
          }
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
        &.outOfTime {
          color: @priceColor;
        }
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
