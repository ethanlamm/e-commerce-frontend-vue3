<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span>
          {{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span>
          {{ showAddress.fullLocation }}{{ showAddress.address }}
        </li>
      </ul>
      <a href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn">切换地址</XtxButton>
      <XtxButton class="btn">添加地址</XtxButton>
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue'
export default {
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    // 展示地址
    // 1.list无数据，展示提示信息
    // 2.list有数据：
    // 2.1从list中找到默认地址，展示，默认地址
    // 2.2list中无默认地址，则展示第一条

    const showAddress = ref(null)
    const addresslist = computed(() => props.list)
    if (addresslist.value && addresslist.value.length) {
      const findResult = addresslist.value.find((item) => item.isDefault === 0)
      if (findResult) {
        // 找到了默认地址
        showAddress.value = findResult
      } else {
        // 没有默认地址 ==> 第一条
        showAddress.value = addresslist.value[0]
      }
    }

    return { showAddress }
  }
}
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
