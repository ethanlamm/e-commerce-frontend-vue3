<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter></SubFilter>
      <!-- 测试 -->
      <XtxCheckbox v-model="checked">全选</XtxCheckbox>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter },
  setup () {
    const checked = ref(true)
    return { checked }
  }
}
</script>

<style lang="less" scoped>
</style>
