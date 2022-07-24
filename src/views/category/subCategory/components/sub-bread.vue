<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="breadObj.top" :to="`/category/${breadObj.top.id}`">
      {{ breadObj.top.name }}
    </XtxBreadItem>
    <transition name="fade-right">
      <XtxBreadItem :key="breadObj.sub.id" v-if="breadObj.sub">
        {{ breadObj.sub.name }}
      </XtxBreadItem>
    </transition>
  </XtxBread>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'SubBread',
  setup () {
    // 依据二级分类的id从vuex中拿数据并进行改造(整理成要用的数据形式)
    const route = useRoute() // 拿路径上的二级分类id
    const store = useStore() // vuex数据源取数据
    const breadObj = computed(() => {
      const temp = {}
      store.state.category.list.forEach((top) => {
        if (top.children) {
          const sub = top.children.find((item) => item.id === route.params.id)
          if (sub) {
            temp.top = { id: top.id, name: top.name }
            temp.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return temp
    })

    return { breadObj }
  }
}
</script>

<style>
</style>
