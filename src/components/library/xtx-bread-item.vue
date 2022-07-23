<template>
  <div class="xtx-bread-item">
    <!-- 传了跳转路径 to，用 routerlink 表示 -->
    <RouterLink v-if="to" :to="to">
      <!-- 插槽放 toName -->
      <slot></slot>
    </RouterLink>
    <!-- 未传跳转路径 to，用 span 表示 -->
    <span v-else>
      <slot></slot>
    </span>
  </div>
  <!-- 不静态创建，用动态创建 -->
  <!-- <i class="iconfont icon-angle-right"></i> -->
</template>

<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>

<style>
</style>
