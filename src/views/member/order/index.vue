<template>
  <div class="orderContainer">
    myorder
    <XtxTabs>
      <xtx-tabs-panel label="标签0" name="0">0</xtx-tabs-panel>
      <xtx-tabs-panel
        v-for="i in 4"
        :key="i"
        :label="`标签${i}`"
        :name="`${i}`"
      >
        {{ i }}
      </xtx-tabs-panel>
    </XtxTabs>
  </div>
</template>

<script>
export default {
  name: 'MemberOrder'
}
</script>

<style>
</style>
