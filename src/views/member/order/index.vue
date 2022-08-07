<template>
  <div class="member-order">
    <XtxTabs v-model="activeName" @tab-change="tabChange">
      <xtx-tabs-panel
        v-for="i in 4"
        :key="i"
        :label="`标签${i}`"
        :name="`name${i}`"
      >
        {{ i }}
      </xtx-tabs-panel>
    </XtxTabs>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'MemberOrder',
  setup (props) {
    // 接收
    const activeName = ref('name1')

    const tabChange = (tab) => {
      console.log(tab)
    }

    return { activeName, tabChange }
  }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background-color: #fff;
}
</style>
