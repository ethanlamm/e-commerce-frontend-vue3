<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div
      v-if="show"
      class="large"
      :style="[{ backgroundImage: `url(${images[currIndex]})` }, largePosition]"
    ></div>
    <!-- 中图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="" />
      <!-- 遮罩层 -->
      <div v-if="show" class="layer" :style="layerPosition"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li
        v-for="(img, i) in images"
        :key="img"
        :class="{ active: i === currIndex }"
      >
        <img @mouseenter="currIndex = i" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    // 默认显示第一张图
    const currIndex = ref(0)

    // 1.大图和遮罩层的显示和隐藏
    const show = ref(false)

    // 2.遮罩层的位置
    const layerPosition = reactive({
      left: 0,
      top: 0
    })

    // 3.大图的位置
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })

    // 4.使用useMouseInElement获取鼠标在目标元素内的位置以及是否在元素内
    const target = ref(null)
    // target：目标元素
    const { elementX, elementY, isOutside } = useMouseInElement(target)

    // 监听鼠标位置的变化，给遮罩层和大图位置赋值
    watch([elementX, elementY, isOutside], () => {
      // 5.移动规则
      show.value = !isOutside.value

      const temp = { x: 0, y: 0 }
      // X,Y可移动范围：[0,200]
      if (elementX.value < 100) {
        temp.x = 0
      } else if (elementX.value > 300) {
        temp.x = 200
      } else {
        // 减去100，达到鼠标在遮罩层中间的效果
        temp.x = elementX.value - 100
      }

      if (elementY.value < 100) {
        temp.y = 0
      } else if (elementY.value > 300) {
        temp.y = 200
      } else {
        // 减去100，达到鼠标在遮罩层中间的效果
        temp.y = elementY.value - 100
      }

      // 6.赋值
      // 6.1遮罩层
      layerPosition.left = temp.x + 'px'
      layerPosition.top = temp.y + 'px'
      // 6.2大图
      largePosition.backgroundPositionX = -2 * temp.x + 'px'
      largePosition.backgroundPositionY = -2 * temp.y + 'px'
    })

    return { currIndex, show, target, layerPosition, largePosition }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
