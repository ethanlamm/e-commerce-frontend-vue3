<template>
  <div class="xtx-carousel" @mouseleave="start()" @mouseenter="stop()">
    <!-- 图片区 -->
    <ul class="carousel-body">
      <li
        class="carousel-item"
        :class="{ fade: currIndex == index }"
        v-for="(item, index) in sliders"
        :key="item.id"
      >
        <RouterLink to="/">
          <img :src="item.imgUrl" />
        </RouterLink>
      </li>
    </ul>
    <!-- 左箭头 -->
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)">
      <i class="iconfont icon-angle-left"></i>
    </a>
    <!-- 右箭头 -->
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)">
      <i class="iconfont icon-angle-right"></i>
    </a>
    <!-- 底部指示器 -->
    <div class="carousel-indicator">
      <span
        v-for="(item, index) in sliders"
        :key="item.id"
        @click="currIndex = index"
        :class="{ active: currIndex == index }"
      ></span>
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    duration: {
      type: Number,
      default: 4000
    },
    autoPlay: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    // console.log(props.sliders);
    // 一、默认显示的图片的索引，靠索引来显示哪张图片，解决图片切换效果
    const currIndex = ref(0)
    // 二、自动轮播
    let timer = null
    const autoPlayFn = () => {
      // 防止定时器重复开启
      clearInterval(timer)
      timer = setInterval(() => {
        // 靠索引来显示哪张图片，解决图片切换效果
        currIndex.value++
        // 最后一张，重置
        if (currIndex.value >= props.sliders.length) {
          currIndex.value = 0
        }
      }, props.duration)
    }
    watch(
      () => props.sliders,
      (newValue) => {
        if (newValue.length && props.autoPlay) {
          // 有数据，且传入自动播放
          currIndex.value = 0
          autoPlayFn()
        }
      },
      { immediate: true }
    )
    // 三、鼠标进入和移开
    const stop = () => {
      if (timer) {
        clearInterval(timer)
      }
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }

    // 四、点击 上一张/下一张
    const toggle = (step) => {
      const newIndex = currIndex.value + step
      // 取值范围 [0，length-1]
      if (newIndex > props.sliders.length - 1) {
        currIndex.value = 0
        return
      }
      if (newIndex < 0) {
        currIndex.value = props.sliders.length - 1
        return
      }

      currIndex.value = newIndex
    }

    // 五、组件消耗，清理定时器
    onUnmounted(() => {
      clearInterval(timer)
    })

    return { currIndex, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      // 开始透明度均为零，即不显示
      opacity: 0;
      transition: opacity 0.5s linear;
      // fade：显示该 li
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        // active：激活，当前图片对应的指示器(点)
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
