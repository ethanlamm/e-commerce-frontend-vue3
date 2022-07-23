<template>
  <div class="home-banner">
    <XtxCarousel :sliders="sliders" autoPlay />
  </div>
</template>
<script>
import { ref } from 'vue'
import { getBanner } from '@/api/home'
export default {
  name: 'HomeBanner',
  setup (props) {
    // 在home-banner组件获取轮播图数据，传递给xtx-carousel组件
    const sliders = ref([])
    getBanner().then((data) => {
      sliders.value = data.result
    })

    return { sliders }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
// 调整左箭头和底部指示器位置(样式覆盖)
// .xtx-carousel {
//   // 左箭头
//   ::v-deep .carousel-btn.prev {
//     left: 270px;
//   }
//   // 底部指示器
//   ::v-deep .carousel-indicator {
//     padding-left: 250px;
//   }
// }
// 深度选择器的改变
.xtx-carousel {
  // 左箭头
  :deep(.carousel-btn.prev) {
    left: 270px;
  }
  // 底部指示器
  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}
</style>
