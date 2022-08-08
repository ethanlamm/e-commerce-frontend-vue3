<template>
  <XtxDialog title="查看物流信息" v-model:visible="visibleDialog">
    <div class="order-logistics-goods" v-if="logistics">
      <a class="image" href="javascript:;">
        <img :src="logistics.picture" alt="" />
        <p>{{ logistics.count }}件商品</p>
      </a>
      <div class="info" v-if="logistics.company">
        <p><span>配送企业：</span>{{ logistics.company.name }}</p>
        <p><span>快递单号：</span>{{ logistics.company.number }}</p>
        <p><span>联系电话：</span>{{ logistics.company.tel }}</p>
      </div>
    </div>
    <div class="order-logistics-list" v-if="logistics">
      <div class="item" v-for="(item, i) in logistics.list" :key="item.id">
        <div class="line" :class="{ active: i === 0 }"></div>
        <div class="logistics">
          <p>{{ item.text }}</p>
          <p>{{ item.time }}</p>
        </div>
      </div>
    </div>
    <div class="loading" v-if="loading"></div>
  </XtxDialog>
</template>

<script>
import { ref } from 'vue'
import { logisticsOrder } from '@/api/my'
export default {
  name: 'OrderLogistic',
  setup (props) {
    const visibleDialog = ref(false)
    // loading
    const loading = ref(false)
    // 打开
    const logistics = ref(null)
    const open = (order) => {
      visibleDialog.value = true
      loading.value = true
      logisticsOrder(order.id).then((data) => {
        logistics.value = data.result
        loading.value = false
      })
    }
    return { visibleDialog, open, logistics, loading }
  }
}
</script>

<style scoped lang="less">
.xtx-dialog :deep(.wrapper) {
  width: 680px;
  min-height: 490px;
  .body {
    width: 100%;
    height: 100%;
    position: relative;
    .loading {
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(255, 255, 255, 0.9)
        url(../../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
.order-logistics-goods {
  display: flex;
  background-color: #f5f5f5;
  height: 130px;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
  font-size: 14px;
  .image {
    width: 92px;
    height: 92px;
    border: 1px solid #e4e4e4;
    position: relative;
    p {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 20px;
      line-height: 20px;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      text-align: center;
    }
  }
  .info {
    flex: 1;
    padding-left: 20px;
    line-height: 30px;
    span {
      color: #999;
    }
  }
}
.order-logistics-list {
  position: relative;
  padding-top: 10px;
  font-size: 14px;
  .item {
    display: flex;
    &:last-child {
      .line {
        border-color: transparent;
        &::before {
          top: 0;
        }
      }
    }
    .line {
      width: 27px;
      border-right: 2px solid #f5f5f5;
      margin-right: 25px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(7px, 0);
        border-radius: 50%;
      }
      &::before {
        width: 12px;
        height: 12px;
        background: #e4e4e4;
      }
      // 激活
      &.active {
        &::before {
          background: @xtxColor;
          z-index: 1;
        }
        &::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(11px, -4px);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          background: #e3f9f4;
        }
      }
    }
    .logistics {
      flex: 1;
      padding-bottom: 35px;
      position: relative;
      top: -3px;
      p {
        &:first-child {
          color: #666;
        }
        &:last-child {
          color: #999;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>
