<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <!-- loading图 -->
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <!-- 商品规格组件 -->
        <GoodsSku
          :goods="goods"
          :skuId="skuId"
          @sendSkuInfo="getSkuInfo"
        ></GoodsSku>
        <!-- 确认按钮 -->
        <XtxButton
          type="primary"
          size="mini"
          style="margin-left: 60px"
          @click="confirm"
        >
          确认
        </XtxButton>
      </template>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/cart'
// 引入商品规格组件
import GoodsSku from '@/views/goods/components/goods-sku.vue'
export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const target = ref(null)
    // 默认隐藏
    const visible = ref(false)
    // loading
    const loading = ref(false)

    // GoodsSku组件需要传入的数据
    // 1.goods:Object {specs[Array],skus[Array]}--展示用
    // 2.skuId:初始化时，渲染选中的规格
    const goods = ref({}) // 需要是对象类型

    // 打开
    const open = () => {
      visible.value = true
      // 打开时，获取最新数据
      loading.value = true
      getSpecsAndSkus(props.skuId).then((data) => {
        goods.value = data.result
        loading.value = false
      })
    }
    // 关闭
    const close = () => {
      visible.value = false
    }
    // 点击其他地方关闭
    onClickOutside(target, () => {
      visible.value = false
    })
    // 切换
    const toggle = () => {
      visible.value ? close() : open()
    }

    // 接收规格组件修改后的sku信息
    const skuInfo = reactive({})
    const getSkuInfo = (data) => {
      skuInfo.value = data
    }

    // 点击确认按钮，将sku信息传出
    const confirm = () => {
      // 修改需要是完整的信息(即有skuId)、并且和旧商品不一样(即skuId不同，新旧不同)
      if (
        skuInfo.value &&
        skuInfo.value.skuId &&
        skuInfo.value.skuId !== props.skuId
      ) {
        emit('change', skuInfo.value)
      }
      // 关闭规格选择
      close()
    }

    return { visible, target, toggle, loading, goods, getSkuInfo, confirm }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
