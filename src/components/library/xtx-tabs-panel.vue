<template>
  <div class="xtx-tabs-panel" v-show="activeName === name">
    <slot></slot>
  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'XtxTabsPanel',
  props: {
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
  },
  setup (props) {
    const activeName = inject('activeName')
    // console.log(activeName); // 接收的为响应式数据

    return { activeName }
  }
}
</script>

