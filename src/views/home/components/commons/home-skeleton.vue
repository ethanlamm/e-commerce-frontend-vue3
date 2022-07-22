
<!-- 与HomeNew、HomeHot组件 “ 内容区 ” 结构一致的骨架组件  -->

<template>
  <div class="home-skeleton">
    <!-- 这里的结构 和 HomeNew/HomeHot 中的内容面板结构一致 -->
    <div class="item" v-for="i in 4" :key="i" :style="{ backgroundColor: bg }">
      <!-- XtxSkeleton:已全局注册的插件==>一个有闪烁动画的div盒子 -->
      <XtxSkeleton bg="#e4e4e4" width="306px" height="306px" animated />
      <XtxSkeleton bg="#e4e4e4" width="160px" height="24px" animated />
      <XtxSkeleton bg="#e4e4e4" width="120px" height="24px" animated />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSkeleton',
  props: {
    bg: {
      type: String,
      default: '#fff'
    }
  }
}
</script>

<style scoped lang='less'>
.home-skeleton {
  width: 1240px;
  height: 406px;
  display: flex;
  justify-content: space-between;
  .item {
    width: 306px;
    .xtx-skeleton ~ .xtx-skeleton {
      display: block;
      margin: 16px auto 0;
    }
  }
}
</style>
