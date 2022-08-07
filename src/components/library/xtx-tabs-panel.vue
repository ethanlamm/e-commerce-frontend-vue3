<template>
  <div class="xtx-tabs-panel">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'XtxTabsPanel',
  pros: {
    // 标签文字
    label: {
      type: String,
      default: ''
    },
    // 每个标签的唯一标识
    name: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>

