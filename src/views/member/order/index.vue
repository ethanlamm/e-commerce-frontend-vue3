<template>
  <div class="orderContainer">
    myorder
    <XtxTabs v-model="activeName" @tab-change="tabChange">
      <xtx-tabs-panel label="标签0" name="name0">0</xtx-tabs-panel>
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
    const activeName = ref('name0')

    const tabChange = (tab) => {
      console.log(tab)
    }

    return { activeName, tabChange }
  }
}
</script>

<style>
</style>
