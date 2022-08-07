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
      <div class="order-item">
        <div class="head">
          <span>下单时间：2018-01-08 15:02:00</span>
          <span>订单编号：62205697599</span>
          <span class="down-time">
            <i class="iconfont icon-down-time"></i>
            <b>付款截止：28分20秒</b>
          </span>
        </div>
        <div class="body">
          <div class="column goods">
            <ul>
              <li v-for="i in 2" :key="i">
                <a class="image" href="javascript:;">
                  <img
                    src="https://yanxuan-item.nosdn.127.net/f7a4f643e245d03771d6f12c94e71214.png"
                    alt=""
                  />
                </a>
                <div class="info">
                  <p class="name ellipsis-2">
                    原创设计一体化机身,精致迷你破壁机350mL
                  </p>
                  <p class="attr ellipsis">
                    <span>颜色：绿色</span>
                    <span>尺寸：10寸</span>
                  </p>
                </div>
                <div class="price">¥9.50</div>
                <div class="count">x1</div>
              </li>
            </ul>
          </div>
          <div class="column state">
            <p>待付款</p>
          </div>
          <div class="column amount">
            <p class="red">¥19.00</p>
            <p>（含运费：¥10.00）</p>
            <p>在线支付</p>
          </div>
          <div class="column action">
            <XtxButton type="primary" size="small">立即付款</XtxButton>
            <p><a href="javascript:;">查看详情</a></p>
            <p><a href="javascript:;">取消订单</a></p>
          </div>
        </div>
      </div>
      <div class="order-item">
        <div class="head">
          <span>下单时间：2018-01-08 15:02:00</span>
          <span>订单编号：62205697599</span>
          <a href="javascript:;" class="del">删除</a>
        </div>
        <div class="body">
          <div class="column goods">
            <ul>
              <li>
                <a class="image" href="javascript:;">
                  <img
                    src="https://yanxuan-item.nosdn.127.net/f7a4f643e245d03771d6f12c94e71214.png"
                    alt=""
                  />
                </a>
                <div class="info">
                  <p class="name ellipsis-2">
                    原创设计一体化机身,精致迷你破壁机350mL
                  </p>
                  <p class="attr ellipsis">
                    <span>颜色：绿色</span>
                    <span>尺寸：10寸</span>
                  </p>
                </div>
                <div class="price">¥9.50</div>
                <div class="count">x1</div>
              </li>
            </ul>
          </div>
          <div class="column state">
            <p>已取消</p>
          </div>
          <div class="column amount">
            <p class="red">¥9.50</p>
            <p>（含运费：¥0.00）</p>
          </div>
          <div class="column action">
            <p><a href="javascript:;">查看详情</a></p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <XtxPagination></XtxPagination>
  </div>
</template>

<script>
import { ref } from 'vue'
import { orderStatus } from '@/api/constant.js'
export default {
  name: 'MemberOrder',
  setup (props) {
    // 默认选中 全部订单
    const activeName = ref('all')

    const tabChange = (tab) => {
      console.log(tab)
    }

    return { activeName, tabChange, orderStatus }
  }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background-color: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
}
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
